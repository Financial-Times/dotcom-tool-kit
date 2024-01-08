import type { Plugin } from '@dotcom-tool-kit/plugin'
import type { ValidPluginsConfig } from '@dotcom-tool-kit/config'

export const mergeInits = (config: ValidPluginsConfig, plugin: Plugin) => {
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
