import prettier from 'prettier'
import { promises as fsp } from 'fs'
import fg from 'fast-glob'
import { hookConsole } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import * as z from 'zod'

const PrettierSchema = z
  .object({
    files: z
      .string()
      .array()
      .or(z.string())
      .default(['**/*.{js,jsx,ts,tsx}'])
      .describe('glob pattern of files to run Prettier on.'),
    configFile: z
      .string()
      .optional()
      .describe(
        "path to a Prettier config file to use. Uses Prettier's built-in [config resolution](https://prettier.io/docs/en/configuration.html) by default."
      ),
    ignoreFile: z
      .string()
      .default('.prettierignore')
      .describe('path to a Prettier [ignore file](https://prettier.io/docs/en/ignore).')
  })
  .describe('Format files with `prettier`.')
export { PrettierSchema as schema }

type PrettierOptions = z.infer<typeof PrettierSchema>

export default class Prettier extends Task<{ task: typeof PrettierSchema }> {
  async run({ files, cwd }: TaskRunContext): Promise<void> {
    try {
      const filepaths = await fg(files ?? this.options.files, { cwd })
      for (const filepath of filepaths) {
        const { ignored } = await prettier.getFileInfo(filepath)
        if (!ignored) {
          await this.formatFile(filepath, this.options)
        }
      }
    } catch (err) {
      const error = new ToolKitError('there was an error running the prettier plugin')
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }

  formatFile = async (filepath: string, options: PrettierOptions): Promise<void> => {
    const fileContent = await fsp.readFile(filepath, 'utf8')
    let prettierConfig
    try {
      prettierConfig = await prettier.resolveConfig(filepath, { config: options.configFile })
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
        const error = new ToolKitError('there was an error when resolving the prettier config')
        if (err instanceof Error) {
          error.details = err.message
        }
        throw error
      }
    }

    const { ignored } = await prettier.getFileInfo(filepath, { ignorePath: this.options.ignoreFile })

    if (ignored) {
      return
    }

    const unhook = hookConsole(this.logger, 'prettier')
    try {
      await fsp.writeFile(filepath, prettier.format(fileContent, { ...prettierConfig, filepath }))
    } finally {
      unhook()
    }
  }
}
