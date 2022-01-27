import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookConsole } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import lintStaged from 'lint-staged'

export default class LintStaged extends Task {
  static description = ''

  async run(): Promise<void> {
    this.logger.info('running lint-staged')
    const unhook = hookConsole(this.logger, 'lint-staged')
    const wasSuccessful = await lintStaged().finally(unhook)

    if (!wasSuccessful) {
      const error = new ToolKitError('lint-staged encountered errors')
      throw error
    }
  }
}
