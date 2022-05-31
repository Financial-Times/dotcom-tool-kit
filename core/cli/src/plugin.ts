import resolveFrom from 'resolve-from'
import type { Logger } from 'winston'

import { Conflict, isConflict } from './conflict'
import { RawConfig, PluginOptions } from './config'
import type { HookTask } from './hook'
import { loadToolKitRC } from './rc-file'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { Hook, Plugin, PluginModule, Task } from '@dotcom-tool-kit/types'
import isPlainObject from 'lodash.isplainobject'

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

export function validatePlugin(plugin: unknown): asserts plugin is PluginModule {
  const rawPlugin = plugin as RawPluginModule

  if (
    rawPlugin.tasks &&
    !(Array.isArray(rawPlugin.tasks) && rawPlugin.tasks.every((task) => Task.isCompatible(task)))
  ) {
    throw new ToolKitError('tasks are not valid')
  }

  if (
    rawPlugin.hooks &&
    !(
      isPlainObject(rawPlugin.hooks) &&
      Object.values(rawPlugin.hooks).every((hook) => Hook.isCompatible(hook))
    )
  ) {
    throw new ToolKitError('hooks are not valid')
  }
}

async function importPlugin(pluginPath: string): Promise<PluginModule> {
  // pluginPath is an absolute resolved path to a plugin module as found from its parent
  const pluginModule = await import(pluginPath)
  validatePlugin(pluginModule)
  return pluginModule
}

export async function loadPlugin(
  id: string,
  config: RawConfig,
  logger: Logger,
  parent?: Plugin
): Promise<Plugin> {
  // don't load duplicate plugins
  if (id in config.plugins) {
    return config.plugins[id]
  }

  // load plugin relative to the parent plugin
  const root = parent ? parent.root : process.cwd()
  const pluginRoot = id === 'app root' ? root : resolveFrom(root, id)

  const plugin: Plugin = {
    id,
    root: pluginRoot,
    parent
  }

  config.plugins[id] = plugin

  // start loading rc file in the background
  const rcFilePromise = loadToolKitRC(pluginRoot)

  // start loading module in the background
  const pluginModulePromise = id === 'app root' ? Promise.resolve(undefined) : importPlugin(pluginRoot)

  plugin.rcFile = await rcFilePromise

  // start loading child plugins in the background
  const childrenPromise = Promise.all(
    plugin.rcFile.plugins.map((child) => loadPlugin(child, config, logger, plugin))
  )

  // wait for pending promises concurrently
  ;[plugin.module, plugin.children] = await Promise.all([pluginModulePromise, childrenPromise])

  return plugin
}

export function resolvePlugin(plugin: Plugin, config: RawConfig, logger: Logger): void {
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
