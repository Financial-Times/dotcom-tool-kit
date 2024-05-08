import type { Plugin, OptionsForPlugin } from '@dotcom-tool-kit/plugin'
import type { ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { isDescendent } from './is-descendent.js'
import { Conflict, isConflict } from '@dotcom-tool-kit/conflict'

// merge options from this plugin's config with any options we've collected already
// TODO this is almost the exact same code as for command tasks, refactor
export const mergePluginOptions = (config: ValidPluginsConfig, plugin: Plugin) => {
  if (plugin.rcFile) {
    for (const [id, configOptions] of Object.entries(plugin.rcFile.options.plugins)) {
      // users can specify root options with the dotcom-tool-kit key to mirror
      // the name of the root npm package
      const pluginId = id === 'dotcom-tool-kit' ? 'app root' : id
      const existingOptions = config.pluginOptions[pluginId]

      const pluginOptions: OptionsForPlugin = {
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

          const conflict: Conflict<OptionsForPlugin> = {
            plugin,
            conflicting: conflicting.concat(pluginOptions)
          }

          config.pluginOptions[pluginId] = conflict
        } else {
          // if we're here, any existing options are from a child plugin,
          // so merge in overrides from the parent
          config.pluginOptions[pluginId] = { ...existingOptions, ...pluginOptions }
        }
      } else {
        // this options key might not have been set yet, in which case use the new one
        config.pluginOptions[pluginId] = pluginOptions
      }
    }
  }
}
