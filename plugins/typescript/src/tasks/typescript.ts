import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { fork } from 'child_process'
import * as z from 'zod/v3'

const TypeScriptSchema = z
  .object({
    configPath: z
      .string()
      .optional()
      .describe(
        "to the [TypeScript config file](https://www.typescriptlang.org/tsconfig). Uses TypeScript's own [tsconfig.json resolution](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#using-tsconfigjson-or-jsconfigjson) by default"
      ),
    build: z
      .literal(true)
      .optional()
      .describe(
        'Run Typescript in [build mode](https://www.typescriptlang.org/docs/handbook/project-references.html#build-mode-for-typescript).'
      ),
    watch: z.literal(true).optional().describe('Run Typescript in watch mode.'),
    noEmit: z
      .literal(true)
      .optional()
      .describe(
        'Run Typescript with `--noEmit`, for checking your types without outputting compiled Javascript.'
      )
  })
  .describe('Compile code with `tsc`.')
export { TypeScriptSchema as schema }

export default class TypeScript extends Task<{ task: typeof TypeScriptSchema }> {
  async run({ cwd }: TaskRunContext): Promise<void> {
    const tscPath = require.resolve('typescript/bin/tsc', { paths: [cwd] })
    const args = []

    // TODO:KB:20240408 refactor this
    if (this.options.build) {
      args.push('--build')
    }

    if (this.options.watch) {
      args.push('--watch')
    }

    if (this.options.noEmit) {
      args.push('--noEmit')
    }

    if (this.options.configPath) {
      args.push('--project', this.options.configPath)
    }

    const child = fork(tscPath, args, { silent: true, cwd })
    hookFork(this.logger, 'typescript', child)
    const exitPromise = waitOnExit('typescript', child)
    // don't wait for tsc to exit if it's set to watch for file changes
    if (!args.includes('--watch')) {
      await exitPromise
    }

    // tsc is quite quiet by default so let the user know it actually ran
    this.logger.info('code compiled successfully')
  }
}
