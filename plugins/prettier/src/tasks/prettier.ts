import prettier from 'prettier'
import { PrettierOptions, PrettierSchema } from '@dotcom-tool-kit/schemas/lib/tasks/prettier'
import { promises as fsp } from 'fs'
import fg from 'fast-glob'
import { hookConsole, styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class Prettier extends Task<{ task: typeof PrettierSchema }> {
  static description = ''

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

    const { ignored } = await prettier.getFileInfo(filepath, { ignorePath: this.options.ignoreFile })

    if (ignored) {
      return
    }

    const unhook = hookConsole(this.logger, 'prettier')
    try {
      await fsp.writeFile(
        filepath,
        prettier.format(fileContent, { ...(prettierConfig as prettier.Options), filepath })
      )
    } finally {
      unhook()
    }
  }
}
