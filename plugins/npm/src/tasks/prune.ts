import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { spawn } from 'node:child_process'

export default class NpmPrune extends Task {
  async run({ cwd }: TaskRunContext): Promise<void> {
    try {
      this.logger.verbose('pruning dev dependencies...')
      const child = spawn('npm', ['prune', '--production'], {
        cwd
      })

      hookFork(this.logger, 'npm', child)
      return waitOnExit('npm', child)
    } catch (err) {
      const error = new ToolKitError('unable to prune dev dependencies')
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }
}
