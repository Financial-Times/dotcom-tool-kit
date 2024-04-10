import type { CommandTask, Plugin } from '@dotcom-tool-kit/plugin'
import type { ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { Conflict, isConflict } from '@dotcom-tool-kit/conflict'
import { isDescendent } from './is-descendent'
import { Logger } from 'winston'
import { styles as s } from '@dotcom-tool-kit/logger'
import path from 'path'

export const mergeCommands = (config: ValidPluginsConfig, plugin: Plugin, logger: Logger) => {
  if (plugin.rcFile) {
    let commands = plugin.rcFile.commands

    if (plugin.rcFile.hooks) {
      commands = plugin.rcFile.hooks
      logger.warn(
        `${s.code('hooks')} is deprecated in ${s.filepath('.toolkitrc.yml')}. please rename ${s.code(
          'hooks'
        )} to ${s.code('commands')} in ${s.filepath(path.join(plugin.root, '.toolkitrc.yml'))}.`
      )
    }

    for (const [id, configCommandTask] of Object.entries(commands)) {
      // handle conflicts between commands from different plugins
      const existingCommandTask = config.commandTasks[id]
      const newCommandTask: CommandTask = {
        id,
        plugin,
        tasks: Array.isArray(configCommandTask) ? configCommandTask : [configCommandTask]
      }

      if (existingCommandTask) {
        const existingFromDescendent = isDescendent(plugin, existingCommandTask.plugin)

        // plugins can only override command tasks from their descendents, otherwise that's a conflict
        // return a conflict either listing this command and the siblings,
        // or merging in a previously-generated command
        if (!existingFromDescendent) {
          const conflicting = isConflict(existingCommandTask)
            ? existingCommandTask.conflicting
            : [existingCommandTask]

          const conflict: Conflict<CommandTask> = {
            plugin,
            conflicting: conflicting.concat(newCommandTask)
          }

          config.commandTasks[id] = conflict
        } else {
          // if we're here, any existing command is from a child plugin,
          // so the parent always overrides it
          config.commandTasks[id] = newCommandTask
        }
      } else {
        // this command task might not have been set yet, in which case use the new one
        config.commandTasks[id] = newCommandTask
      }
    }
  }
}
