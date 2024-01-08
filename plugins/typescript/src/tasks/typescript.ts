import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import type { TypeScriptSchema } from '@dotcom-tool-kit/schemas/lib/plugins/typescript'
import { fork } from 'child_process'

const tscPath = require.resolve('typescript/bin/tsc')

export default abstract class TypeScriptTask extends Task<{ plugin: typeof TypeScriptSchema }> {
  abstract taskArgs: string[]

  async run(): Promise<void> {
    // TODO: add monorepo support with --build option
    const args = [...this.taskArgs]
    if (this.pluginOptions.configPath) {
      args.unshift('--project', this.pluginOptions.configPath)
    }
    if (this.pluginOptions.extraArgs) {
      args.push(...this.pluginOptions.extraArgs)
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
