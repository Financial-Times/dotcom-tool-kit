import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import mapWorkspaces from '@npmcli/map-workspaces'
import fs from 'fs/promises'
import path from 'path'
import { loadConfig } from 'dotcom-tool-kit/lib/config'
import { runTasksFromConfig } from 'dotcom-tool-kit/lib/tasks'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class WorkspaceCommand extends Task {
  async runPackageCommand(packageId: string, packagePath: string, command: string, files?: string[]) {
    const config = await loadConfig(this.logger, { root: packagePath })

    return runTasksFromConfig(this.logger.child({ packageId }), config, [command], files)
  }

  async run({ cwd, command, files }: TaskRunContext) {
    const pkg = JSON.parse(await fs.readFile(path.join(cwd, 'package.json'), 'utf8'))

    const workspaces = await mapWorkspaces({ cwd, pkg })

    const packagePromises: Array<Promise<void>> = []

    for (const [id, packagePath] of workspaces) {
      packagePromises.push(this.runPackageCommand(id, packagePath, command, files))
    }

    const results = await Promise.allSettled(packagePromises)
    const erroredCommands = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    if (erroredCommands.length) {
      // TODO improve error messages
      const error = new ToolKitError(`error running workspace command ${command}`)
      error.details = erroredCommands.map((result) => result.reason.toString()).join('\n\n')
      throw error
    }
  }
}
