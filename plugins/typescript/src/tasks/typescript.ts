import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import type { TypeScriptSchema } from '@dotcom-tool-kit/schemas/tasks/typescript.js'
import { fork } from 'child_process'
import { fileURLToPath } from 'url'

const tscPath = fileURLToPath(import.meta.resolve('typescript/bin/tsc'))

export default class TypeScript extends Task<{ task: typeof TypeScriptSchema }> {
  async run(): Promise<void> {
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

    const child = fork(tscPath, args, { silent: true })
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
