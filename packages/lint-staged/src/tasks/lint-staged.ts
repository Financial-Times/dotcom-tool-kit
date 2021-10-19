import { ToolKitError } from '@dotcom-tool-kit/error'
import { Task } from '@dotcom-tool-kit/task'
import lintStaged from 'lint-staged'

export default class LintStaged extends Task {
  static description = ''

  async run(): Promise<void> {
    const wasSuccessful = await lintStaged()

    if (!wasSuccessful) {
      const error = new ToolKitError('lint-staged encountered errors')
      throw error
    }
  }
}
