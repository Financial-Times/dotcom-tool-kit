import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { runTasksFromConfig } from 'dotcom-tool-kit/lib/tasks'
import { WorkspaceCommandSchema } from '@dotcom-tool-kit/schemas/lib/tasks/workspace-command'
import {minimatch} from 'minimatch'
import pluralize from 'pluralize'
import { styles } from '@dotcom-tool-kit/logger'
import LoadWorkspaceConfigs from '../load-workspace-configs'


export default class WorkspaceCommand extends Task<{ task: typeof WorkspaceCommandSchema }> {
  async run({ command, files }: TaskRunContext) {
    const results = await Promise.allSettled(
      LoadWorkspaceConfigs.configs.map(async ({ config, packageId, root }) => {
        if(!this.options.packageFilter || minimatch(root, this.options.packageFilter)) {
          await runTasksFromConfig(this.logger.child({ packageId }), config, [command], files)
        }
      })
    )

    const erroredCommands = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    if (erroredCommands.length) {
      throw new AggregateError(
        erroredCommands.map(result => result.reason),
        `${pluralize('error', erroredCommands.length, true)} running workspace command ${styles.command(this.options.command ?? command)}`
      )
    }
  }
}
