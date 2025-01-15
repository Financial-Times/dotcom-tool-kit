import { ToolKitError } from '@dotcom-tool-kit/error'
import { styles } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { ESLint } from 'eslint'
import * as z from 'zod'

const ESLintSchema = z
  .object({
    configPath: z
      .string()
      .optional()
      .describe(
        'Path to the [ESLint config file](https://eslint.org/docs/v8.x/use/configure/configuration-files) to use.'
      ),
    files: z
      .string()
      .array()
      .or(z.string())
      .default(['**/*.js'])
      .describe(
        'The glob patterns for lint target files. This can either be a string or an array of strings.'
      )
  })
  .describe('Runs `eslint` to lint and format target files.')
export { ESLintSchema as schema }

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
