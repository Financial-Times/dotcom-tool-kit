import { Task } from '@dotcom-tool-kit/types'
import { ToolKitError } from '@dotcom-tool-kit/error'
import * as exec from '@actions/exec'

export default class NpmPrune extends Task {
  static description = ''

  async run(): Promise<void> {
    try {
      await exec.exec(`npm prune --production`, [], {
        cwd: './'
      })
    } catch {
      throw new ToolKitError(`Unable to prune dev dependencies`)
    }
  }
}
