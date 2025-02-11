import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookConsole } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import lintStaged from 'lint-staged'

export default class LintStaged extends Task {
  static description = 'Run `lint-staged` in your repo, for use with git hooks.'

  async run({ cwd }: TaskRunContext): Promise<void> {
    this.logger.info('running lint-staged')
    const unhook = hookConsole(this.logger, 'lint-staged')
    const wasSuccessful = await lintStaged({ cwd }).finally(unhook)

    if (!wasSuccessful) {
      const error = new ToolKitError('lint-staged encountered errors')
      throw error
    }
  }
}
