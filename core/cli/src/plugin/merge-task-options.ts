import type { Plugin, OptionsForTask } from '@dotcom-tool-kit/plugin'
import type { ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { type Conflict, isConflict } from '@dotcom-tool-kit/conflict'

import { isDescendent } from './is-descendent'

// merge options from this plugin's config with any options we've collected already
// TODO this is almost the exact same code as for command tasks, refactor
export const mergeTaskOptions = (config: ValidPluginsConfig, plugin: Plugin) => {
  if (plugin.rcFile) {
    for (const [taskId, configOptions] of Object.entries(plugin.rcFile.options.tasks)) {
      const existingOptions = config.taskOptions[taskId]

      const taskOptions: OptionsForTask = {
        options: configOptions,
        plugin,
        task: taskId
      }

      if (existingOptions) {
        const existingFromDescendent = isDescendent(plugin, existingOptions.plugin)

        // plugins can only override options from their descendents, otherwise it's a conflict
        // return a conflict either listing these options and the sibling's,
        // or merging in previously-generated options
        if (!existingFromDescendent) {
          const conflicting = isConflict(existingOptions) ? existingOptions.conflicting : [existingOptions]

          const conflict: Conflict<OptionsForTask> = {
            plugin,
            conflicting: conflicting.concat(taskOptions)
          }

          config.taskOptions[taskId] = conflict
        } else {
          // if we're here, any existing options are from a child plugin,
          // so merge in overrides from the parent
          config.taskOptions[taskId] = { ...existingOptions, ...taskOptions }
        }
      } else {
        // this options key might not have been set yet, in which case use the new one
        config.taskOptions[taskId] = taskOptions
      }
    }
  }
}
