import { Task } from '@dotcom-tool-kit/types'
import { ToolKitError } from '@dotcom-tool-kit/error'
import * as exec from '@actions/exec'

export default class NpmPrune extends Task {
  static description = ''

  async run(): Promise<void> {
    try {
      console.log('pruning dev dependencies...')
      await exec.exec(`npm prune --production`, [], {
        cwd: './'
      })
    } catch (err) {
      const error = new ToolKitError('unable to prune dev dependencies')
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }
}
