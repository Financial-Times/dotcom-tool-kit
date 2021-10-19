import { ESLint } from 'eslint'
import { ESLintOptions, ESLintSchema } from '@dotcom-tool-kit/types/lib/schema/eslint'
import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class Eslint extends Task<typeof ESLintSchema> {
  static description = ''

  static defaultOptions: ESLintOptions = {
    files: ['**/*.js']
  }

  async run(files?: string[]): Promise<void> {
    const eslint = new ESLint(this.options.config)
    const results = await eslint.lintFiles(files ?? this.options.files)
    const formatter = await eslint.loadFormatter('stylish')
    const resultText = formatter.format(results)

    const errorCount = results.reduce((count, result) => count + result.errorCount, 0)

    if (errorCount > 0) {
      const error = new ToolKitError('eslint returned linting errors')
      error.details = resultText
      error.exitCode = errorCount
      throw error
    } else {
      console.log(resultText)
    }
  }
}
