import { ESLint } from 'eslint'
import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'

type EslintOptions = {
  files: string[] | string
  config?: ESLint.Options
}

export default class Eslint extends Task<EslintOptions> {
  static description = ''

  static defaultOptions: EslintOptions = {
    files: '**/*.js'
  }

  async run(): Promise<void> {
    const eslint = new ESLint(this.options.config)
    const results = await eslint.lintFiles(this.options.files)
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
