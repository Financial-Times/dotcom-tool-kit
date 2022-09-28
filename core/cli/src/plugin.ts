import { styles as s } from '@dotcom-tool-kit/logger'
import {
  Hook,
  joinValidated,
  mapValidated,
  mapValidationError,
  Plugin,
  PluginModule,
  reduceValidated,
  Task,
  Valid,
  Validated
} from '@dotcom-tool-kit/types'
import isPlainObject from 'lodash/isPlainObject'
import resolveFrom from 'resolve-from'
import type { Logger } from 'winston'
import { PluginOptions, RawConfig, ValidPluginsConfig } from './config'
import { Conflict, isConflict } from './conflict'
import type { HookTask } from './hook'
import { loadToolKitRC } from './rc-file'

type RawPluginModule = Partial<PluginModule>

function isDescendent(possibleAncestor: Plugin, possibleDescendent: Plugin): boolean {
  if (!possibleDescendent.parent) {
    return false
  } else if (possibleDescendent.parent === possibleAncestor) {
    return true
  } else {
    return isDescendent(possibleAncestor, possibleDescendent.parent)
  }
}

const indentReasons = (reasons: string): string => reasons.replace(/\n/g, '\n  ')

export function validatePlugin(plugin: unknown): Validated<PluginModule> {
  const errors: string[] = []
  const rawPlugin = plugin as RawPluginModule

  if (rawPlugin.tasks) {
    if (!Array.isArray(rawPlugin.tasks)) {
      errors.push(`the exported ${s.code('tasks')} value from this plugin is not an array`)
    } else {
      const validatedTasks = reduceValidated(
        rawPlugin.tasks.map((task) =>
          mapValidationError(Task.isCompatible(task), (reasons) => [
            `the task ${s.task(task.name)} is not a compatible instance of ${s.code(
              'Task'
            )}:\n  - ${reasons.join('\n  - ')}`
          ])
        )
      )
      if (!validatedTasks.valid) {
        errors.push(...validatedTasks.reasons)
      }
    }
  }

  if (rawPlugin.hooks) {
    if (!isPlainObject(rawPlugin.hooks)) {
      errors.push(`the exported ${s.code('hooks')} value from this plugin is not an object`)
    } else {
      const validatedHooks = reduceValidated(
        Object.entries(rawPlugin.hooks).map(([id, hook]) =>
          mapValidationError(Hook.isCompatible(hook), (reasons) => [
            `the hook ${s.hook(id)} is not a compatible instance of ${s.code('Hook')}:\n  - ${reasons.join(
              '\n  - '
            )}`
          ])
        )
      )
      if (!validatedHooks.valid) {
        errors.push(...validatedHooks.reasons)
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, reasons: errors }
  } else {
    const pluginModule = { tasks: rawPlugin.tasks ?? [], hooks: rawPlugin.hooks ?? {} }
    return { valid: true, value: pluginModule }
  }
}

async function importPlugin(pluginPath: string): Promise<Validated<PluginModule>> {
  try {
    // pluginPath is an absolute resolved path to a plugin module as found from its parent
    const pluginModule = (await import(pluginPath)) as unknown
    return validatePlugin(pluginModule)
  } catch (e) {
    const err = e as Error
    return {
      valid: false,
      reasons: [
        `an error was thrown when loading this plugin's entrypoint:\n  ${s.code(
          indentReasons(err.toString())
        )}`
      ]
    }
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
  let pluginRoot: string
  try {
    pluginRoot = isAppRoot ? root : resolveFrom(root, id)
  } catch (e) {
    return { valid: false, reasons: [`could not find path for name ${s.filepath(id)}`] }
  }

  const plugin: Valid<Plugin> = {
    valid: true,
    value: {
      id,
      root: pluginRoot,
      parent
    }
  }

  config.plugins[id] = plugin

  // start loading rc file in the background
  const rcFilePromise = loadToolKitRC(logger, pluginRoot, isAppRoot)

  // start loading module in the background
  const pluginModulePromise: Promise<Validated<PluginModule | undefined>> = isAppRoot
    ? Promise.resolve({ valid: true, value: undefined })
    : importPlugin(pluginRoot)

  plugin.value.rcFile = await rcFilePromise

  // start loading child plugins in the background
  const childrenPromise = Promise.all(
    plugin.value.rcFile.plugins.map((child) => loadPlugin(child, config, logger, plugin.value))
  )

  // wait for pending promises concurrently
  const [module, children] = await Promise.all([pluginModulePromise, childrenPromise])

  const validatedModule = mapValidationError(module, (reasons) => [
    indentReasons(`plugin ${s.plugin(id)} failed to load because:\n- ${reasons.join('\n- ')}`)
  ])
  const validatedChildren = mapValidationError(reduceValidated(children), (reasons) => [
    indentReasons(`some child plugins of ${s.plugin(id)} failed to load:\n- ${reasons.join('\n- ')}`)
  ])

  return mapValidated(joinValidated(validatedModule, validatedChildren), ([module, children]) => {
    // avoid cloning the plugin value with an object spread as we do object
    // reference comparisons in multiple places
    plugin.value.module = module
    plugin.value.children = children
    return plugin.value
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

  if (plugin.module) {
    // add plugin tasks to our task registry, handling any conflicts
    for (const newTask of plugin.module.tasks || []) {
      const taskId = newTask.name
      const existingTask = config.tasks[taskId]

      newTask.plugin = plugin
      newTask.id = taskId

      if (existingTask) {
        const conflicting = isConflict(existingTask) ? existingTask.conflicting : [existingTask]

        config.tasks[taskId] = {
          plugin,
          conflicting: conflicting.concat(newTask)
        }
      } else {
        config.tasks[taskId] = newTask
      }
    }

    // add hooks to the registry, handling any conflicts
    // TODO refactor with command conflict handler
    for (const [hookId, hookClass] of Object.entries(plugin.module.hooks || [])) {
      const existingHook = config.hooks[hookId]
      const newHook: Hook = new (hookClass as any)(logger)

      newHook.id = hookId
      newHook.plugin = plugin

      if (existingHook) {
        const conflicting = isConflict(existingHook) ? existingHook.conflicting : [existingHook]

        config.hooks[hookId] = {
          plugin,
          conflicting: conflicting.concat(newHook)
        }
      } else {
        config.hooks[hookId] = newHook
      }
    }
  }

  if (plugin.rcFile) {
    // load plugin hook tasks. do this after loading child plugins, so
    // parent hooks get assigned after child hooks and can override them
    for (const [id, configHookTask] of Object.entries(plugin.rcFile.hooks)) {
      // handle conflicts between hooks from different plugins
      const existingHookTask = config.hookTasks[id]
      const newHookTask: HookTask = {
        id,
        plugin,
        tasks: Array.isArray(configHookTask) ? configHookTask : [configHookTask]
      }

      if (existingHookTask) {
        const existingFromDescendent = isDescendent(plugin, existingHookTask.plugin)

        // plugins can only override hook tasks from their descendents, otherwise that's a conflict
        // return a conflict either listing this hook and the siblings,
        // or merging in a previously-generated hook
        if (!existingFromDescendent) {
          const conflicting = isConflict(existingHookTask) ? existingHookTask.conflicting : [existingHookTask]

          const conflict: Conflict<HookTask> = {
            plugin,
            conflicting: conflicting.concat(newHookTask)
          }

          config.hookTasks[id] = conflict
        } else {
          // if we're here, any existing hook is from a child plugin,
          // so the parent always overrides it
          config.hookTasks[id] = newHookTask
        }
      } else {
        // this hook task might not have been set yet, in which case use the new one
        config.hookTasks[id] = newHookTask
      }
    }

    // merge options from this plugin's config with any options we've collected already
    // TODO this is almost the exact same code as for hooks, refactor
    for (const [id, configOptions] of Object.entries(plugin.rcFile.options)) {
      const existingOptions = config.options[id]

      const pluginOptions: PluginOptions = {
        options: configOptions,
        plugin,
        forPlugin: config.plugins[id]
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

          config.options[id] = conflict
        } else {
          // if we're here, any existing options are from a child plugin,
          // so merge in overrides from the parent
          config.options[id] = { ...existingOptions, ...pluginOptions }
        }
      } else {
        // this options key might not have been set yet, in which case use the new one
        config.options[id] = pluginOptions
      }
    }
  }

  config.resolvedPlugins.add(plugin)
}
