import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookConsole } from '@dotcom-tool-kit/logger'
import type { BabelOptions } from '@dotcom-tool-kit/types/lib/schema/plugins/babel'
import * as babel from '@babel/core'
import fg from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'
import type { Logger } from 'winston'

export async function runBabel(
  logger: Logger,
  options: BabelOptions,
  transformOptions?: babel.TransformOptions
): Promise<void> {
  const fileGlob = options.files ?? 'src/**/*.js'
  const files = await fg(fileGlob)
  // Work out the root of the glob so we can strip this part of the path out of
  // the outputted files.
  // E.g., a glob of 'src/**/*.js'   = src/a/b.js -> lib/a/b.js
  //       a glob of 'src/a/**/*.js' = src/a/b.js -> lib/b.js
  const { base } = fg.generateTasks(fileGlob)[0]

  const outputPath = options.outputPath ?? 'lib'

  if (options.configFile) {
    const { configFile } = options
    transformOptions = transformOptions ? { ...transformOptions, configFile } : { configFile }
  }

  logger.info('running babel')
  const unhook = hookConsole(logger, 'babel')
  await Promise.all(
    files.map(async (file) => {
      const transformed = await babel.transformFileAsync(file, transformOptions)
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
