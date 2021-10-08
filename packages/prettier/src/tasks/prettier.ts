import prettier from 'prettier'
import { promises as fsp } from 'fs'
import fg from 'fast-glob'
import { Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'

type PrettierOptions = {
  files: string[] | string
  configFile?: string
  configOptions?: prettier.Options
}

export default class Prettier extends Task<PrettierOptions> {
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

  async run(): Promise<void> {
    try {
      !Array.isArray(this.options.files) ? (this.options.files = [this.options.files]) : ''
      const filepaths = await fg(this.options.files)
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
  if (options.configFile) {
    prettierConfig = await prettier.resolveConfig(options.configFile)
    if (!prettierConfig) {
      console.log(
        `prettier could not find the specified configFile (${options.configFile}), using configOptions instead`
      )
      prettierConfig = options.configOptions
    }
  } else {
    prettierConfig = options.configOptions
  }
  await fsp.writeFile(
    filepath,
    prettier.format(fileContent, { ...(prettierConfig as prettier.Options), filepath })
  )
}
