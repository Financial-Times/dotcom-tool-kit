import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import { ESLintSchema } from '@dotcom-tool-kit/schemas/lib/plugins/eslint'
import { ESLint } from 'eslint'

export default class Eslint extends Task<{ plugin: typeof ESLintSchema }> {
  static description = ''

  async run(files?: string[]): Promise<void> {
    const eslint = new ESLint(this.pluginOptions.options)
    const results = await eslint.lintFiles(files ?? this.pluginOptions.files)
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(results)

    const errorCount = results.reduce((count, result) => count + result.errorCount, 0)

    if (errorCount > 0) {
      const error = new ToolKitError('eslint returned linting errors')
      error.details = resultText
      error.exitCode = errorCount
      throw error
    } else {
      this.logger.info(styles.title('ESLint output was:'))
      this.logger.info(resultText)
    }
  }
}
