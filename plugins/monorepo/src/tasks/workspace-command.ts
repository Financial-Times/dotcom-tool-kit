import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { runTasksFromConfig } from 'dotcom-tool-kit/lib/tasks'
import { WorkspaceCommandSchema } from '@dotcom-tool-kit/schemas/lib/tasks/workspace-command'
import {minimatch} from 'minimatch'
import pluralize from 'pluralize'
import { styles } from '@dotcom-tool-kit/logger'
import LoadWorkspaceConfigs from '../load-workspace-configs'


export default class WorkspaceCommand extends Task<{ task: typeof WorkspaceCommandSchema }> {
  async run({ command, files }: TaskRunContext) {
    const configsWithCommand = LoadWorkspaceConfigs.configs.filter(
      ({config}) => command in config.commandTasks
    )

    this.logger.info(`Running ${styles.command(command)} in:
${configsWithCommand.map(({ packageId }) => `- ${styles.plugin(packageId)}`).join('\n')}
`)

    const results = await Promise.allSettled(
      configsWithCommand.map(async ({ config, packageId, root }) => {
        if(!this.options.packageFilter || minimatch(root, this.options.packageFilter)) {
          await runTasksFromConfig(this.logger.child({ packageId }), config, [command], files).catch(
            error => {
              error.name = `${styles.plugin(packageId)} → ${error.name}`
              throw error
            }
          )
        }
      })
    )

    const erroredCommands = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    if (erroredCommands.length) {
      throw new AggregateError(
        erroredCommands.map(result => result.reason),
        `${pluralize('error', erroredCommands.length, true)} running command ${styles.command(this.options.command ?? command)} in workspace packages`
      )
    }
  }
}
