import importFrom from 'import-from'
import resolveFrom from 'resolve-from'
import mergeWith from 'lodash.mergewith'

import type { TaskClass } from '@dotcom-tool-kit/task'
import type { Hook } from '@dotcom-tool-kit/hook'
import type { HookTask } from './hook'
import { Conflict, isConflict } from './conflict'
import { Config, PluginOptions } from './config'
import { loadToolKitRC, RCFile } from './rc-file'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { Plugin, instantiatePlugin } from '@dotcom-tool-kit/hook'
import { styles } from './messages'

export async function loadPluginConfig(plugin: Plugin, config: Config): Promise<Config> {
  const { plugins = [], hooks = {}, options = {} } = await loadToolKitRC(plugin.root)

  // load any plugins requested by this plugin
  await loadPlugins(plugins, config, plugin)

  // load plugin hook tasks. do this after loading child plugins, so
  // parent hooks get assigned after child hooks and can override them
  mergeWith(
    config.hookTasks,
    hooks,

    // handle conflicts between hooks from different plugins
    (
      existingHookTask: HookTask | Conflict<HookTask> | undefined,
      configHookTask: string | string[],
      id
    ): HookTask | Conflict<HookTask> => {
      const newHookTask: HookTask = {
        id,
        plugin,
        tasks: Array.isArray(configHookTask) ? configHookTask : [configHookTask]
      }

      // this hook task might not have been set yet, in which case use the new one
      if (!existingHookTask) {
        return newHookTask
      }

      const existingFromSibling =
        existingHookTask.plugin.parent && existingHookTask.plugin.parent === plugin.parent

      // if the existing hook was from a sibling, that's a conflict
      // return a conflict either listing this hook and the siblings,
      // or merging in a previously-generated hook
      if (existingFromSibling) {
        const conflicting = isConflict(existingHookTask) ? existingHookTask.conflicting : [existingHookTask]

        const conflict: Conflict<HookTask> = {
          plugin,
          conflicting: conflicting.concat(newHookTask)
        }

        return conflict
      }

      // if we're here, any existing hook is from a child plugin,
      // so the parent always overrides it
      return newHookTask
    }
  )

  // merge options from this plugin's config with any options we've collected already
  // TODO this is almost the exact same code as for hooks, refactor
  mergeWith(
    config.options,
    options,
    (existingOptions: PluginOptions | Conflict<PluginOptions>, configOptions: RCFile['options'], id) => {
      const pluginOptions: PluginOptions = {
        options: configOptions,
        plugin,
        forPlugin: config.plugins[id]
      }

      // this options key might not have been set yet, in which case use the new one
      if (!existingOptions) {
        return pluginOptions
      }

      const existingFromSibling =
        existingOptions.plugin.parent && existingOptions.plugin.parent === plugin.parent

      // if the existing options were from a sibling, that's a conflict
      // return a conflict either listing these options and the sibling's,
      // or merging in previously-generated options
      if (existingFromSibling) {
        const conflicting = isConflict(existingOptions) ? existingOptions.conflicting : [existingOptions]

        const conflict: Conflict<PluginOptions> = {
          plugin,
          conflicting: conflicting.concat(pluginOptions)
        }

        return conflict
      }

      // if we're here, any existing options are from a child plugin,
      // so merge in overrides from the parent
      return { ...existingOptions, ...pluginOptions }
    }
  )

  return config
}

export async function loadPlugin(id: string, config: Config, parent?: Plugin): Promise<Plugin> {
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
    basePlugin = instantiatePlugin(rawPlugin)
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
  mergeWith(
    config.tasks,
    Object.fromEntries((plugin.tasks || []).map((task) => [task.name, task])),
    (
      existingTask: TaskClass | Conflict<TaskClass>,
      newTask: TaskClass,
      taskId
    ): TaskClass | Conflict<TaskClass> => {
      newTask.plugin = plugin
      newTask.id = taskId

      if (!existingTask) {
        return newTask
      }

      const conflicting = isConflict(existingTask) ? existingTask.conflicting : [existingTask]

      return {
        plugin,
        conflicting: conflicting.concat(newTask)
      }
    }
  )

  // add hooks to the registry, handling any conflicts
  // TODO refactor with command conflict handler
  mergeWith(
    config.hooks,
    plugin.hooks,

    (existingHook: Hook | Conflict<Hook>, newHook: Hook, hookId): Hook | Conflict<Hook> => {
      newHook.id = hookId
      newHook.plugin = plugin

      if (!existingHook) {
        return newHook
      }

      const conflicting = isConflict(existingHook) ? existingHook.conflicting : [existingHook]

      return {
        plugin,
        conflicting: conflicting.concat(newHook)
      }
    }
  )

  await loadPluginConfig(plugin, config)

  return plugin
}

export function loadPlugins(plugins: string[], config: Config, parent?: Plugin): Promise<Plugin[]> {
  return Promise.all(plugins.map((plugin) => loadPlugin(plugin, config, parent)))
}
