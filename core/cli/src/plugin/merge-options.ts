import { Plugin, PluginOptions, ValidPluginsConfig } from '@dotcom-tool-kit/types'
import { isDescendent } from './is-descendent'
import { Conflict, isConflict } from '@dotcom-tool-kit/conflict'

// merge options from this plugin's config with any options we've collected already
// TODO this is almost the exact same code as for command tasks, refactor
export const mergePluginOptions = (config: ValidPluginsConfig, plugin: Plugin) => {
  if (plugin.rcFile) {
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
}
