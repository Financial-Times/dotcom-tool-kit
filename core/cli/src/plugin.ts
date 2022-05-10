import importFrom from 'import-from'
import resolveFrom from 'resolve-from'
import type { Logger } from 'winston'

import { Conflict, isConflict } from './conflict'
import { Config, PluginOptions } from './config'
import type { HookTask } from './hook'
import { loadToolKitRC } from './rc-file'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { Hook, Plugin, RawPlugin, Task } from '@dotcom-tool-kit/types'
import isPlainObject from 'lodash.isplainobject'
import mapValues from 'lodash.mapvalues'

function isDescendent(possibleAncestor: Plugin, possibleDescendent: Plugin): boolean {
  if (!possibleDescendent.parent) {
    return false
  } else if (possibleDescendent.parent === possibleAncestor) {
    return true
  } else {
    return isDescendent(possibleAncestor, possibleDescendent.parent)
  }
}

export async function loadPluginConfig(logger: Logger, plugin: Plugin, config: Config): Promise<Config> {
  const { plugins, hooks, options } = await loadToolKitRC(plugin.root)

  // load any plugins requested by this plugin
  await loadPlugins(logger, plugins, config, plugin)

  // load plugin hook tasks. do this after loading child plugins, so
  // parent hooks get assigned after child hooks and can override them
  for (const [id, configHookTask] of Object.entries(hooks)) {
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
  for (const [id, configOptions] of Object.entries(options)) {
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

  return config
}

export function instantiatePlugin(plugin: unknown, logger: Logger): Plugin {
  const rawPlugin = plugin as RawPlugin

  const parent = rawPlugin.parent && instantiatePlugin(rawPlugin.parent, logger)

  if (
    rawPlugin.tasks &&
    !(Array.isArray(rawPlugin.tasks) && rawPlugin.tasks.every((task) => task.prototype instanceof Task))
  ) {
    throw new ToolKitError('tasks are not valid')
  }

  if (
    rawPlugin.hooks &&
    !(
      isPlainObject(rawPlugin.hooks) &&
      Object.values(rawPlugin.hooks).every((hook) => hook.prototype instanceof Hook)
    )
  ) {
    throw new ToolKitError('hooks are not valid')
  }

  const hooks = mapValues(rawPlugin.hooks, (Hook) => {
    return new Hook(logger)
  })
  return { ...rawPlugin, parent, hooks }
}

export async function loadPlugin(
  logger: Logger,
  id: string,
  config: Config,
  parent?: Plugin
): Promise<Plugin> {
  // don't load duplicate plugins
  if (id in config.plugins) {
    return config.plugins[id]
  }

  const root = parent ? parent.root : process.cwd()

  // load plugin relative to the parent plugin
  const pluginRoot = resolveFrom(root, id)
  const rawPlugin = importFrom(root, id)
  let basePlugin
  try {
    basePlugin = instantiatePlugin(rawPlugin, logger)
  } catch (error) {
    if (error instanceof ToolKitError) {
      error.details = `the package ${styles.plugin(id)} at ${styles.filepath(
        pluginRoot
      )} is not a valid plugin`
    }
    throw error
  }
  const plugin: Plugin = {
    ...basePlugin,
    id,
    root: pluginRoot,
    parent
  }

  config.plugins[id] = plugin

  // add plugin tasks to our task registry, handling any conflicts
  for (const newTask of plugin.tasks || []) {
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
  for (const [hookId, newHook] of Object.entries(plugin.hooks || [])) {
    const existingHook = config.hooks[hookId]

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

  await loadPluginConfig(logger, plugin, config)

  return plugin
}

export function loadPlugins(
  logger: Logger,
  plugins: string[],
  config: Config,
  parent?: Plugin
): Promise<Plugin[]> {
  return Promise.all(plugins.map((plugin) => loadPlugin(logger, plugin, config, parent)))
}
