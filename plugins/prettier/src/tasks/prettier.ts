import prettier from 'prettier'
import { PrettierOptions, PrettierSchema } from '@dotcom-tool-kit/types/lib/schema/prettier'
import { promises as fsp } from 'fs'
import fg from 'fast-glob'
import hookStd from 'hook-std'
import styles from '@dotcom-tool-kit/styles'
import { Task } from '@dotcom-tool-kit/types'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class Prettier extends Task<typeof PrettierSchema> {
  static description = ''

  static defaultOptions: PrettierOptions = {
    files: ['**/*.js'],
    configOptions: {
      singleQuote: true,
      useTabs: true,
      bracketSpacing: true,
      arrowParens: 'always',
      trailingComma: 'none'
    }
  }

  async run(files?: string[]): Promise<void> {
    try {
      const filepaths = await fg(files ?? this.options.files)
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
    if (!prettierConfig && options.configOptions) {
      this.logger.warn(
        `prettier could not find the specified configFile${
          options.configFile ? ` (${styles.filepath(options.configFile)})` : ''
        }), using ${styles.option('configOptions')} instead`
      )
      prettierConfig = options.configOptions
    }

    const { unhook: unhookStd } = hookStd.stderr({ silent: true }, (output) => {
      this.logger.info(output.trim(), { process: 'prettier' })
    })
    const { unhook: unhookErr } = hookStd.stderr({ silent: true }, (output) => {
      this.logger.warn(output.trim(), { process: 'prettier' })
    })
    await fsp.writeFile(
      filepath,
      prettier.format(fileContent, { ...(prettierConfig as prettier.Options), filepath })
    )
    unhookStd()
    unhookErr()
  }
}
