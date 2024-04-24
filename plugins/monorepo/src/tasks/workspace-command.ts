import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import mapWorkspaces from '@npmcli/map-workspaces'
import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'
import { loadConfig } from 'dotcom-tool-kit/lib/config'
import { runTasksFromConfig } from 'dotcom-tool-kit/lib/tasks'
import { ToolKitError } from '@dotcom-tool-kit/error'

const WorkspaceCommandSchema = z.object({
  command: z.string().optional()
})
export { WorkspaceCommandSchema as schema }

export default class WorkspaceCommand extends Task<{ task: typeof WorkspaceCommandSchema }> {
  async runPackageCommand(packageId: string, packagePath: string, command: string, files?: string[]) {
    const config = await loadConfig(this.logger, { root: packagePath })

    return runTasksFromConfig(this.logger.child({ packageId }), config, [command], files)
  }

  async run({ cwd, command, files }: TaskRunContext) {
    const pkg = JSON.parse(await fs.readFile(path.join(cwd, 'package.json'), 'utf8'))

    const workspaces = await mapWorkspaces({ cwd, pkg })

    const results = await Promise.allSettled(
      Array.from(workspaces, ([id, packagePath]) =>
        this.runPackageCommand(id, packagePath, this.options.command ?? command, files)
      )
    )

    const erroredCommands = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    if (erroredCommands.length) {
      // TODO improve error messages
      const error = new ToolKitError(`error running workspace command ${this.options.command ?? command}`)
      error.details = erroredCommands.map((result) => result.reason.toString()).join('\n\n')
      throw error
    }
  }
}
