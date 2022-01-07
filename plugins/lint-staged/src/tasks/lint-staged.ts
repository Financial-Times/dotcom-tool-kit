import { ToolKitError } from '@dotcom-tool-kit/error'
import { Task } from '@dotcom-tool-kit/types'
import lintStaged from 'lint-staged'

export default class LintStaged extends Task {
  static description = ''

  async run(): Promise<void> {
    console.log('running lint-staged...')
    const wasSuccessful = await lintStaged()

    if (!wasSuccessful) {
      const error = new ToolKitError('lint-staged encountered errors')
      throw error
    }
  }
}
