import { styles as s } from '@dotcom-tool-kit/logger'
import { Hook, Plugin, PluginModule, Task } from '@dotcom-tool-kit/types'
import isPlainObject from 'lodash.isplainobject'
import resolveFrom from 'resolve-from'
import type { Logger } from 'winston'
import {
  joinValidated,
  mapValidated,
  PluginOptions,
  RawConfig,
  sequenceValidated,
  Valid,
  Validated,
  ValidPluginsConfig
} from './config'
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

export function validatePlugin(plugin: unknown): Validated<PluginModule> {
  const makeInvalid = (reason: string): Invalid => ({ valid: false, reasons: [reason] })

  const rawPlugin = plugin as RawPluginModule

  if (rawPlugin.tasks) {
    if (!Array.isArray(rawPlugin.tasks)) {
      return makeInvalid(`the exported ${s.dim('tasks')} value from this plugin is not an array`)
    }
    const incompatibleTasks = rawPlugin.tasks.filter((task) => !Task.isCompatible(task))
    if (incompatibleTasks.length === 1) {
      return makeInvalid(`the task ${s.task(incompatibleTasks[0].name)} is not a compatible instance of Task`)
    } else if (incompatibleTasks.length > 1) {
      return makeInvalid(
        `the tasks ${incompatibleTasks.map((task) => s.task(task.name))} are not compatible instances of Task`
      )
    }
  }

  if (rawPlugin.hooks) {
    if (!isPlainObject(rawPlugin.hooks)) {
      return makeInvalid(`the exported ${s.dim('hooks')} value from this plugin is not an object`)
    }
    const incompatibleHooks = Object.entries(rawPlugin.hooks).filter(([, hook]) => !Hook.isCompatible(hook))
    if (incompatibleHooks.length === 1) {
      return makeInvalid(`the hook ${s.hook(incompatibleHooks[0][0])} is not a compatible instance of Hook`)
    } else if (incompatibleHooks.length > 1) {
      return makeInvalid(
        `the hooks ${incompatibleHooks.map(([id]) => s.hook(id))} are not compatible instances of Hook`
      )
    }
  }

  const pluginModule = { tasks: rawPlugin.tasks ?? [], hooks: rawPlugin.hooks ?? {} }
  return { valid: true, value: pluginModule }
}

async function importPlugin(pluginPath: string): Promise<Validated<PluginModule>> {
  try {
    // pluginPath is an absolute resolved path to a plugin module as found from its parent
    const pluginModule = (await import(pluginPath)) as unknown
    return validatePlugin(pluginModule)
  } catch (e) {
    return { valid: false, reasons: ["an error was thrown when loading this plugin's entrypoint"] }
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

  // load plugin relative to the parent plugin
  const root = parent ? parent.root : process.cwd()
  const pluginRoot = id === 'app root' ? root : resolveFrom(root, id)

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
  const rcFilePromise = loadToolKitRC(pluginRoot)

  // start loading module in the background
  const pluginModulePromise: Promise<Validated<PluginModule | undefined>> =
    id === 'app root' ? Promise.resolve({ valid: true, value: undefined }) : importPlugin(pluginRoot)

  plugin.value.rcFile = await rcFilePromise

  // start loading child plugins in the background
  const childrenPromise = Promise.all(
    plugin.value.rcFile.plugins.map((child) => loadPlugin(child, config, logger, plugin.value))
  )

  // wait for pending promises concurrently
  const [validatedModule, children] = await Promise.all([pluginModulePromise, childrenPromise])
  const validatedChildren = sequenceValidated(children)

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
      const newHook = new hookClass(logger)

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
