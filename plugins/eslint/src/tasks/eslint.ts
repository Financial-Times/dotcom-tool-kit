import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { ESLintSchema } from '@dotcom-tool-kit/schemas/lib/tasks/eslint'
import { ESLint } from 'eslint'

export default class Eslint extends Task<{ task: typeof ESLintSchema }> {
  async run({ files, cwd }: TaskRunContext): Promise<void> {
    const eslint = new ESLint({ overrideConfigFile: this.options.configPath, cwd })
    const results = await eslint.lintFiles(files ?? this.options.files)
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(results)

    const errorCount = results.reduce((count, result) => count + result.errorCount, 0)

    if (errorCount > 0) {
      const error = new ToolKitError('eslint returned linting errors')
      error.details = resultText
      throw error
    } else {
      this.logger.info(styles.title('ESLint output was:'))
      this.logger.info(resultText)
    }
  }
}
