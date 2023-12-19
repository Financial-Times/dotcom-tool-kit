import { EntryPoint, Plugin, ValidPluginsConfig } from '@dotcom-tool-kit/types'
import { isConflict } from '@dotcom-tool-kit/types/src/conflict'

// add plugin tasks to our task registry, handling any conflicts
export const mergePluginTasks = (config: ValidPluginsConfig, plugin: Plugin) => {
  if (plugin.rcFile) {
    for (const [taskName, modulePath] of Object.entries(plugin.rcFile.tasks || {})) {
      const existingTaskId = config.tasks[taskName]
      const entryPoint: EntryPoint = {
        plugin,
        modulePath
      }

      if (existingTaskId) {
        const conflicting = isConflict(existingTaskId) ? existingTaskId.conflicting : [existingTaskId]

        config.tasks[taskName] = {
          plugin,
          conflicting: conflicting.concat(entryPoint)
        }
      } else {
        config.tasks[taskName] = entryPoint
      }
    }
  }
}
