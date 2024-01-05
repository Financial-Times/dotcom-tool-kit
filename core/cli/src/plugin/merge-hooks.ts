import { EntryPoint, Plugin, ValidPluginsConfig } from '@dotcom-tool-kit/types'
import { isConflict } from '@dotcom-tool-kit/conflict'

export const mergePluginHooks = (config: ValidPluginsConfig, plugin: Plugin) => {
  if (plugin.rcFile) {
    // add hooks to the registry, handling any conflicts
    // TODO refactor with command conflict handler
    for (const [hookName, modulePath] of Object.entries(plugin.rcFile.installs || {})) {
      const existingHookId = config.hooks[hookName]
      const entryPoint: EntryPoint = {
        plugin,
        modulePath
      }

      if (existingHookId) {
        const conflicting = isConflict(existingHookId) ? existingHookId.conflicting : [existingHookId]

        config.hooks[hookName] = {
          plugin,
          conflicting: conflicting.concat(entryPoint)
        }
      } else {
        config.hooks[hookName] = entryPoint
      }
    }
  }
}
