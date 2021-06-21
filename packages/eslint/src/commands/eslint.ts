import { Command } from '@oclif/command'
import { ESLint } from 'eslint'
import { ToolKitError } from '@dotcom-tool-kit/error'

interface EslintOptions {
  files: string[] | string
}

export default class EslintCommand extends Command {
  static description = ''
  static flags = {}
  static args = []

  options: EslintOptions = {
    files: '**/*.js'
  }

  async run(): Promise<void> {
    const eslint = new ESLint()
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
