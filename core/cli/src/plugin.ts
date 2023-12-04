import { styles as s } from '@dotcom-tool-kit/logger'
import {
  HookClass,
  HookInstallation,
  invalid,
  Plugin,
  reduceValidated,
  valid,
  Validated
} from '@dotcom-tool-kit/types'
import resolvePkg from 'resolve-pkg'
import type { Logger } from 'winston'
import { EntryPoint, PluginOptions, RawConfig, ValidPluginsConfig, ValidConfig } from './config'
import { Conflict, isConflict } from '@dotcom-tool-kit/types/lib/conflict'
import type { CommandTask } from './command'
import { loadToolKitRC } from './rc-file'
import { groupBy, isPlainObject } from 'lodash'
import { Base } from '@dotcom-tool-kit/types/src/base'
import { HookSchemas, Options as HookOptions } from '@dotcom-tool-kit/types/src/hooks'

function isDescendent(possibleAncestor: Plugin, possibleDescendent: Plugin): boolean {
  if (!possibleDescendent.parent) {
    return false
  } else if (possibleDescendent.parent === possibleAncestor) {
    return true
  } else {
    return isDescendent(possibleAncestor, possibleDescendent.parent)
  }
}

const isPlainObjectGuard = (value: unknown): value is Record<string, unknown> => isPlainObject(value)

// the subclasses of Base have different constructor signatures so we need to omit
// the constructor from the type bound here so you can actually pass in a subclass
export async function importEntryPoint<T extends { name: string } & Omit<typeof Base, 'new'>>(
  type: T,
  entryPoint: EntryPoint
): Promise<Validated<T>> {
  const resolvedPath = resolvePkg(entryPoint.modulePath, { cwd: entryPoint.plugin.root })

  if (!resolvedPath) {
    return invalid([
      `could not find entrypoint ${s.filepath(entryPoint.modulePath)} in plugin ${s.plugin(
        entryPoint.plugin.id
      )}`
    ])
  }

  let pluginModule: unknown
  try {
    pluginModule = await import(resolvedPath)
  } catch (e) {
    const err = e as Error
    return invalid([
      `an error was thrown when loading entrypoint ${s.filepath(entryPoint.modulePath)} in plugin ${s.plugin(
        entryPoint.plugin.id
      )}:\n  ${s.code(indentReasons(err.toString()))}`
    ])
  }

  if (
    isPlainObjectGuard(pluginModule) &&
    'default' in pluginModule &&
    typeof pluginModule.default === 'function'
  ) {
    const name = pluginModule.default.name

    return type
      .isCompatible<T>(pluginModule.default)
      .mapError((reasons) => [
        `the ${type.name.toLowerCase()} ${s.hook(name)} is not a compatible instance of ${s.code(
          type.name
        )}:\n  - ${reasons.join('\n  - ')}`
      ])
  } else {
    return invalid([
      `entrypoint ${s.filepath(entryPoint.modulePath)} in plugin ${s.plugin(
        entryPoint.plugin.id
      )} does not have a ${s.code('default')} export`
    ])
  }
}

const indentReasons = (reasons: string): string => reasons.replace(/\n/g, '\n  ')

export async function loadPlugin(
  id: string,
  config: RawConfig,
  logger: Logger,
  parent?: Plugin
): Promise<Validated<Plugin>> {
  // don't load duplicate plugins
  if (id in config.plugins) {
    return config.plugins[id]
  }

  const isAppRoot = id === 'app root'

  // load plugin relative to the parent plugin
  const root = parent ? parent.root : process.cwd()
  const pluginRoot = isAppRoot ? root : resolvePkg(id, { cwd: root })
  if (!pluginRoot) {
    return invalid([`could not find path for name ${s.filepath(id)}`])
  }

  const plugin = {
    id,
    root: pluginRoot,
    parent,
    rcFile: await loadToolKitRC(logger, pluginRoot, isAppRoot),
    children: [] as Plugin[]
  }

  // ESlint disable explanation: erroring due to a possible race condition but is a false positive since the config variable isn't from another scope and can't be written to concurrently.
  // eslint-disable-next-line require-atomic-updates
  config.plugins[id] = valid(plugin)

  const children = await Promise.all(
    plugin.rcFile.plugins.map((child) => loadPlugin(child, config, logger, plugin))
  )

  const validatedChildren = reduceValidated(children).mapError((reasons) => [
    indentReasons(`some child plugins of ${s.plugin(id)} failed to load:\n- ${reasons.join('\n- ')}`)
  ])

  return validatedChildren.map((children) => {
    // avoid cloning the plugin value with an object spread as we do object
    // reference comparisons in multiple places
    plugin.children = children
    return plugin
  })
}

export function resolvePlugin(plugin: Plugin, config: ValidPluginsConfig, logger: Logger): void {
  // don't resolve plugins that have already been resolved to prevent self-conflicts
  // between plugins included at multiple points in the tree
  if (config.resolvedPlugins.has(plugin)) {
    return
  }

  if (plugin.children) {
    // resolve child plugins first so parents can override the things their children set
    for (const child of plugin.children) {
      resolvePlugin(child, config, logger)
    }
  }

  if (plugin.rcFile) {
    // add plugin tasks to our task registry, handling any conflicts
    for (const [taskName, modulePath] of Object.entries(plugin.rcFile.tasks || {})) {
      const existingTaskId = config.tasks[taskName]
      const entryPoint: EntryPoint = {
        plugin,
        modulePath
      }

      if (existingTaskId) {
        const conflicting = isConflict(existingTaskId) ? existingTaskId.conflicting : [existingTaskId]

        config.tasks[taskName] = {
          plugin,
          conflicting: conflicting.concat(entryPoint)
        }
      } else {
        config.tasks[taskName] = entryPoint
      }
    }

    // add hooks to the registry, handling any conflicts
    // TODO refactor with command conflict handler
    for (const [hookName, modulePath] of Object.entries(plugin.rcFile.installs || {})) {
      const existingHookId = config.hooks[hookName]
      const entryPoint: EntryPoint = {
        plugin,
        modulePath
      }

      if (existingHookId) {
        const conflicting = isConflict(existingHookId) ? existingHookId.conflicting : [existingHookId]

        config.hooks[hookName] = {
          plugin,
          conflicting: conflicting.concat(entryPoint)
        }
      } else {
        config.hooks[hookName] = entryPoint
      }
    }

    // load plugin command tasks. do this after loading child plugins, so
    // parent commands get assigned after child commands and can override them
    for (const [id, configCommandTask] of Object.entries(plugin.rcFile.commands)) {
      // handle conflicts between commands from different plugins
      const existingCommandTask = config.commandTasks[id]
      const newCommandTask: CommandTask = {
        id,
        plugin,
        tasks: Array.isArray(configCommandTask) ? configCommandTask : [configCommandTask]
      }

      if (existingCommandTask) {
        const existingFromDescendent = isDescendent(plugin, existingCommandTask.plugin)

        // plugins can only override command tasks from their descendents, otherwise that's a conflict
        // return a conflict either listing this command and the siblings,
        // or merging in a previously-generated command
        if (!existingFromDescendent) {
          const conflicting = isConflict(existingCommandTask)
            ? existingCommandTask.conflicting
            : [existingCommandTask]

          const conflict: Conflict<CommandTask> = {
            plugin,
            conflicting: conflicting.concat(newCommandTask)
          }

          config.commandTasks[id] = conflict
        } else {
          // if we're here, any existing command is from a child plugin,
          // so the parent always overrides it
          config.commandTasks[id] = newCommandTask
        }
      } else {
        // this command task might not have been set yet, in which case use the new one
        config.commandTasks[id] = newCommandTask
      }
    }

    // merge options from this plugin's config with any options we've collected already
    // TODO this is almost the exact same code as for command tasks, refactor
    for (const [id, configOptions] of Object.entries(plugin.rcFile.options)) {
      // users can specify root options with the dotcom-tool-kit key to mirror
      // the name of the root npm package
      const pluginId = id === 'dotcom-tool-kit' ? 'app root' : id
      const existingOptions = config.options[pluginId]

      const pluginOptions: PluginOptions = {
        options: configOptions,
        plugin,
        forPlugin: config.plugins[pluginId]
      }

      if (existingOptions) {
        const existingFromDescendent = isDescendent(plugin, existingOptions.plugin)

        // plugins can only override options from their descendents, otherwise it's a conflict
        // return a conflict either listing these options and the sibling's,
        // or merging in previously-generated options
        if (!existingFromDescendent) {
          const conflicting = isConflict(existingOptions) ? existingOptions.conflicting : [existingOptions]

          const conflict: Conflict<PluginOptions> = {
            plugin,
            conflicting: conflicting.concat(pluginOptions)
          }

          config.options[pluginId] = conflict
        } else {
          // if we're here, any existing options are from a child plugin,
          // so merge in overrides from the parent
          config.options[pluginId] = { ...existingOptions, ...pluginOptions }
        }
      } else {
        // this options key might not have been set yet, in which case use the new one
        config.options[pluginId] = pluginOptions
      }
    }
  }

  config.resolvedPlugins.add(plugin)
}

// this function recursively collects all the hook installation requests from all plugins,
// and merges them into a single, flat array of HookInstallation objects and/or Conflicts.
//
// it works depth-first (i.e. recurses into child plugins first), and considers how to
// merge options or create conflicts in two stages: 1) when considering all installations
// from child plugins, and 2) when considering how a parent plugin would override its
// children. these steps are separate as a particular parent might not provide an override
// for all its children, and different hooks could expect different ways of resolving
// conflicts.
//
// the actual logic for this is delegated to static methods on Hook classes,
// `Hook.mergeChildInstallations` and `Hook.overrideChildInstallations`, so separate hooks
// can provide different logic for these steps.
//
// the default logic in the base Hook class is to always consider multiple installations
// from child plugins as a conflict, and always consider a installation in a parent as
// completely replacing any installations from children.
//
// for example, for a plugin `p` that depends on children `a`, `b`, and `c` that all provide
// configuration for the `PackageJson` hook, this function will:
//   - do all this logic for `a`, `b`, and `c`
//   - call `Hook.mergeChildInstallations` with the appropriate concrete Hook class, and
//     the resulting installations and/or conflicts from `a`, `b`, and `c`
//   - call `Hook.overrideChildInstallations` with the appropriate concrete Hook class, and
//     the resulting installations and/or conflicts from `Hook.mergeChildInstallations` and `p`
export async function reducePluginHookInstallations(
  logger: Logger,
  config: ValidConfig,
  hookClasses: Record<string, HookClass>,
  plugin: Plugin
): Promise<(HookInstallation | Conflict<HookInstallation>)[]> {
  if (!plugin.rcFile) {
    return []
  }

  const rawChildInstallations = await Promise.all(
    (plugin.children ?? []).map((child) => reducePluginHookInstallations(logger, config, hookClasses, child))
  ).then((installations) => installations.flat())

  const childInstallations = Object.entries(
    groupBy(rawChildInstallations, (installation) =>
      isConflict(installation) ? installation.conflicting[0].forHook : installation.forHook
    )
  ).flatMap(([forHook, installations]) => {
    const hookClass = hookClasses[forHook]

    return hookClass.mergeChildInstallations(plugin, installations)
  })

  if (plugin.rcFile.hooks.length === 0) {
    return childInstallations
  }

  return plugin.rcFile.hooks.flatMap((hookEntry) =>
    Object.entries(hookEntry).flatMap(([id, configHookOptions]) => {
      const hookClass = hookClasses[id]
      const parsedOptions = HookSchemas[id as keyof HookOptions].parse(configHookOptions)

      const installation: HookInstallation = {
        options: parsedOptions,
        plugin,
        forHook: id,
        hookConstructor: hookClass
      }

      return hookClass.overrideChildInstallations(plugin, installation, childInstallations)
    })
  )
}
