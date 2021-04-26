import importFrom from 'import-from'
import resolveFrom from 'resolve-from'
import mergeWith from 'lodash.mergewith'

import type { CommandClass } from './command'
import type { Lifecycle } from './lifecycle'
import { Conflict, isConflict } from './conflict'
import { config, PluginOptions } from './config'
import { loadToolKitRC } from './rc-file'

export interface Plugin {
   id: string
   root: string
   parent?: Plugin
   commands?: {
      [id: string]: CommandClass
   }
}

export async function loadPluginConfig(plugin: Plugin) {
   const { plugins = [], lifecycles = {}, options = {} } = await loadToolKitRC(plugin.root)

   // add plugin commands to our command registry, handling any conflicts
   mergeWith(
      config.commands,
      plugin.commands,

      (existingCommand: CommandClass | Conflict<CommandClass>, newCommand: CommandClass, commandId): CommandClass | Conflict<CommandClass> => {
         newCommand.plugin = plugin
         newCommand.id = commandId

         if(!existingCommand) {
            return newCommand
         }

         const conflicting = isConflict(existingCommand)
            ? existingCommand.conflicting
            : [existingCommand]

         return {
            plugin,
            conflicting: conflicting.concat(newCommand)
         }
      }
   )

   // load any plugins requested by this plugin
   await loadPlugins(plugins, plugin)

   // load plugin lifecycle assignments. do this after loading child plugins, so
   // parent lifecycles get assigned after child lifecycles and can override them
   mergeWith(
      config.lifecycles,
      lifecycles,

      // handle conflicts between lifecycles from different plugins
      (existingLifecycle: Lifecycle | Conflict<Lifecycle> | undefined, configLifecycle: string | string[], id): Lifecycle | Conflict<Lifecycle> => {
         const newLifecycle: Lifecycle = {
            id,
            plugin,
            commands: Array.isArray(configLifecycle) ? configLifecycle : [configLifecycle],
         }

         // this lifecycle might not have been set yet, in which case use the new one
         if(!existingLifecycle) {
            return newLifecycle
         }

         const existingFromSibling = existingLifecycle.plugin.parent && existingLifecycle.plugin.parent === plugin.parent

         // if the existing lifecycle was from a sibling, that's a conflict
         // return a conflict either listing this lifecycle and the siblings,
         // or merging in a previously-generated lifecycle
         if(existingFromSibling) {
            const conflicting = isConflict(existingLifecycle)
               ? existingLifecycle.conflicting
               : [existingLifecycle]

            const conflict: Conflict<Lifecycle> = {
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
      (existingOptions: PluginOptions | Conflict<PluginOptions>, configOptions: Object, id) => {
         const pluginOptions: PluginOptions = {
            options: configOptions,
            plugin,
            forPlugin: config.plugins[id]
         }

         // this lifecycle might not have been set yet, in which case use the new one
         if(!existingOptions) {
            return pluginOptions
         }

         const existingFromSibling = existingOptions.plugin.parent && existingOptions.plugin.parent === plugin.parent

         // if the existing options were from a sibling, that's a conflict
         // return a conflict either listing these options and the sibling's,
         // or merging in previously-generated options
         if(existingFromSibling) {
            const conflicting = isConflict(existingOptions)
               ? existingOptions.conflicting
               : [existingOptions]

            const conflict: Conflict<PluginOptions> = {
               plugin,
               conflicting: conflicting.concat(pluginOptions)
            }

            return conflict
         }

         // if we're here, any existing options are from a child plugin,
         // so merge in overrides from the parent
         return { ...existingOptions , ...pluginOptions }
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
   const basePlugin = importFrom.silent(root, id) as Plugin
   const plugin: Plugin = {
      ...basePlugin,
      id,
      root: pluginRoot,
      parent
   }

   config.plugins[id] = plugin
   await loadPluginConfig(plugin)

   return plugin
}

export function loadPlugins(plugins: string[], parent?: Plugin) {
   return Promise.all(plugins.map(
      plugin => loadPlugin(plugin, parent)
   ))
}
