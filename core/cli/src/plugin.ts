import { styles as s } from '@dotcom-tool-kit/logger'
import {
  CommandTask,
  EntryPoint,
  invalid,
  Plugin,
  PluginOptions,
  RawConfig,
  reduceValidated,
  valid,
  Validated,
  ValidPluginsConfig
} from '@dotcom-tool-kit/types'
import resolvePkg from 'resolve-pkg'
import type { Logger } from 'winston'
import { Conflict, isConflict } from '@dotcom-tool-kit/types/lib/conflict'
import { loadToolKitRC } from './rc-file'
import { indentReasons } from './messages'

function isDescendent(possibleAncestor: Plugin, possibleDescendent: Plugin): boolean {
  if (!possibleDescendent.parent) {
    return false
  } else if (possibleDescendent.parent === possibleAncestor) {
    return true
  } else {
    return isDescendent(possibleAncestor, possibleDescendent.parent)
  }
}

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

  return reduceValidated(children)
    .mapError((reasons) => [
      indentReasons(`some child plugins of ${s.plugin(id)} failed to load:\n- ${reasons.join('\n- ')}`)
    ])
    .map((children) => {
      // avoid cloning the plugin value with an object spread as we do object
      // reference comparisons in multiple places
      plugin.children = children
      return plugin
    })
}

export function resolvePlugin(plugin: Plugin, config: ValidPluginsConfig, logger: Logger): void {
  // don't resolve plugins that have already been resolved to prevent self-conflicts
  // between plugins included at multiple points in the tree
  if (config.resolvedPlugins.has(plugin.id)) {
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

  config.resolvedPlugins.add(plugin.id)
}
