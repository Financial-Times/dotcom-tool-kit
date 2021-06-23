import importFrom from 'import-from'
import resolveFrom from 'resolve-from'
import mergeWith from 'lodash.mergewith'

import type { CommandClass } from './command'
import type { LifecycleAssignment, LifecycleClass } from './lifecycle'
import { Conflict, isConflict } from './conflict'
import { config, PluginOptions } from './config'
import { loadToolKitRC, RCFile } from './rc-file'

export interface Plugin {
  id: string
  root: string
  parent?: Plugin
  commands?: {
    [id: string]: CommandClass
  }
  lifecycles?: {
    [id: string]: LifecycleClass
  }
}

export async function loadPluginConfig(plugin: Plugin): Promise<void> {
  const { plugins = [], lifecycles = {}, options = {} } = await loadToolKitRC(plugin.root)

  // load any plugins requested by this plugin
  await loadPlugins(plugins, plugin)

  // load plugin lifecycle assignments. do this after loading child plugins, so
  // parent lifecycles get assigned after child lifecycles and can override them
  mergeWith(
    config.lifecycleAssignments,
    lifecycles,

    // handle conflicts between lifecycles from different plugins
    (
      existingLifecycle: LifecycleAssignment | Conflict<LifecycleAssignment> | undefined,
      configLifecycle: string | string[],
      id
    ): LifecycleAssignment | Conflict<LifecycleAssignment> => {
      const newLifecycle: LifecycleAssignment = {
        id,
        plugin,
        commands: Array.isArray(configLifecycle) ? configLifecycle : [configLifecycle]
      }

      // this lifecycle might not have been set yet, in which case use the new one
      if (!existingLifecycle) {
        return newLifecycle
      }

      const existingFromSibling =
        existingLifecycle.plugin.parent && existingLifecycle.plugin.parent === plugin.parent

      // if the existing lifecycle was from a sibling, that's a conflict
      // return a conflict either listing this lifecycle and the siblings,
      // or merging in a previously-generated lifecycle
      if (existingFromSibling) {
        const conflicting = isConflict(existingLifecycle)
          ? existingLifecycle.conflicting
          : [existingLifecycle]

        const conflict: Conflict<LifecycleAssignment> = {
          plugin,
          conflicting: conflicting.concat(newLifecycle)
        }

        return conflict
      }

      // if we're here, any existing lifecycle is from a child plugin,
      // so the parent always overrides it
      return newLifecycle
    }
  )

  // merge options from this plugin's config with any options we've collected already
  // TODO this is almost the exact same code as for lifecycles, refactor
  mergeWith(
    config.options,
    options,
    (existingOptions: PluginOptions | Conflict<PluginOptions>, configOptions: RCFile['options'], id) => {
      const pluginOptions: PluginOptions = {
        options: configOptions,
        plugin,
        forPlugin: config.plugins[id]
      }

      // this lifecycle might not have been set yet, in which case use the new one
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
}

export async function loadPlugin(id: string, parent?: Plugin): Promise<Plugin> {
  // don't load duplicate commands
  if (id in config.plugins) {
    return config.plugins[id]
  }

  const root = parent ? parent.root : process.cwd()

  // load plugin relative to the parent plugin
  const pluginRoot = resolveFrom(root, id)
  const basePlugin = importFrom(root, id) as Plugin
  const plugin: Plugin = {
    ...basePlugin,
    id,
    root: pluginRoot,
    parent
  }

  config.plugins[id] = plugin

  // add plugin commands to our command registry, handling any conflicts
  mergeWith(
    config.commands,
    plugin.commands,

    (
      existingCommand: CommandClass | Conflict<CommandClass>,
      newCommand: CommandClass,
      commandId
    ): CommandClass | Conflict<CommandClass> => {
      newCommand.plugin = plugin
      newCommand.id = commandId

      if (!existingCommand) {
        return newCommand
      }

      const conflicting = isConflict(existingCommand) ? existingCommand.conflicting : [existingCommand]

      return {
        plugin,
        conflicting: conflicting.concat(newCommand)
      }
    }
  )

  console.log(plugin.id, plugin.lifecycles)

  // add lifecycles to the registry, handling any conflicts
  // TODO refactor with command conflict handler
  mergeWith(
    config.lifecycles,
    plugin.lifecycles,

    (
      existingLifecycle: LifecycleClass | Conflict<LifecycleClass>,
      newLifecycle: LifecycleClass,
      lifecycleId
    ): LifecycleClass | Conflict<LifecycleClass> => {
      newLifecycle.id = lifecycleId
      newLifecycle.plugin = plugin

      if (!existingLifecycle) {
        return newLifecycle
      }

      const conflicting = isConflict(existingLifecycle) ? existingLifecycle.conflicting : [existingLifecycle]

      return {
        plugin,
        conflicting: conflicting.concat(newLifecycle)
      }
    }
  )

  await loadPluginConfig(plugin)

  return plugin
}

export function loadPlugins(plugins: string[], parent?: Plugin): Promise<Plugin[]> {
  return Promise.all(plugins.map((plugin) => loadPlugin(plugin, parent)))
}
