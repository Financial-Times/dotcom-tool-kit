import { Plugin, ValidPluginsConfig } from '@dotcom-tool-kit/types'

export const mergePluginInits = (config: ValidPluginsConfig, plugin: Plugin) => {
  if (plugin.rcFile) {
    // no conflict resolution needed; we'll just run them all ig
    config.inits.push(
      ...plugin.rcFile.init.map((init) => ({
        plugin,
        modulePath: init
      }))
    )
  }
}
