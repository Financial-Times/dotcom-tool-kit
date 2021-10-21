import prettier from 'prettier'
import { PrettierOptions, PrettierSchema } from '@dotcom-tool-kit/types/lib/schema/prettier'
import { promises as fsp } from 'fs'
import fg from 'fast-glob'
import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class Prettier extends Task<typeof PrettierSchema> {
  static description = ''

  static defaultOptions: PrettierOptions = {
    files: ['{,!(node_modules)/**/}*.js'],
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
        await formatFile(filepath, this.options)
      }
    } catch (err) {
      const error = new ToolKitError('there was an error running the prettier plugin')
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }
}

const formatFile = async (filepath: string, options: PrettierOptions) => {
  const fileContent = await fsp.readFile(filepath, 'utf8')
  let prettierConfig
  try {
    prettierConfig = await prettier.resolveConfig(filepath, { config: options.configFile })
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err
    }
  }
  if (!prettierConfig && options.configOptions) {
    console.log(
      `prettier could not find the specified configFile (${options.configFile}), using configOptions instead`
    )
    prettierConfig = options.configOptions
  }
  await fsp.writeFile(
    filepath,
    prettier.format(fileContent, { ...(prettierConfig as prettier.Options), filepath })
  )
}
