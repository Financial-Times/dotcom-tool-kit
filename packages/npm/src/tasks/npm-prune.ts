import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'
import exec from '@actions/exec'

export default class NpmPrune extends Task {
  static description = ''

  async run(): Promise<void> {
    try {
      await exec.exec(`npm prune --production`)
    } catch {
      throw new ToolKitError(`Unable to prune dev dependencies`)
    }
  }
}
