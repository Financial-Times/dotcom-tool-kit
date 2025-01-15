import { promises as fs } from 'fs'
import path from 'path'

import * as babel from '@babel/core'
import fg from 'fast-glob'
import { z } from 'zod'

import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookConsole } from '@dotcom-tool-kit/logger'

const BabelSchema = z
  .object({
    files: z.string().default('src/**/*.js').describe('a glob pattern of files to build in your repo'),
    outputPath: z.string().default('lib').describe('folder to output built files into'),
    configFile: z
      .string()
      .optional()
      .describe('path to the Babel [config file](https://babeljs.io/docs/configuration) to use'),
    envName: z
      .union([z.literal('production'), z.literal('development')])
      .describe('the Babel [environment](https://babeljs.io/docs/options#env) to use')
  })
  .describe('Compile files with Babel')
export { BabelSchema as schema }

export default class Babel extends Task<{ task: typeof BabelSchema }> {
  async run({ cwd }: TaskRunContext): Promise<void> {
    const fileGlob = this.options.files
    const files = await fg(fileGlob, { cwd })
    // Work out the root of the glob so we can strip this part of the path out of
    // the outputted files.
    // E.g., a glob of 'src/**/*.js'   = src/a/b.js -> lib/a/b.js
    //       a glob of 'src/a/**/*.js' = src/a/b.js -> lib/b.js
    const { base } = fg.generateTasks(fileGlob)[0]

    const outputPath = this.options.outputPath

    this.logger.info('running babel')
    const unhook = hookConsole(this.logger, 'babel')

    await Promise.all(
      files.map(async (file) => {
        const transformed = await babel.transformFileAsync(file, {
          configFile: this.options.configFile,
          envName: this.options.envName
        })
        // TODO better error handling
        if (!transformed?.code) {
          const error = new ToolKitError('Babel failed to generate code')
          error.details = `the problematic file was ${file}`
          throw error
        }
        // Create parent directories if they don't exist before creating child file of transpiled code.
        const filePath = path.join(outputPath, path.relative(base, file))
        await fs.mkdir(path.dirname(filePath), { recursive: true })
        await fs.writeFile(filePath, transformed.code)
      })
    )

    unhook()
  }
}
