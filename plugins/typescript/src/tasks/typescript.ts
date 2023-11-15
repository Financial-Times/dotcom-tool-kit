import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import type { TypeScriptSchema } from '@dotcom-tool-kit/types/lib/schema/plugins/typescript'
import { fork } from 'child_process'

const tscPath = require.resolve('typescript/bin/tsc')

abstract class TypeScriptTask extends Task<typeof TypeScriptSchema> {
  abstract taskArgs: string[]

  async run(): Promise<void> {
    // TODO: add monorepo support with --build option
    const args = [...this.taskArgs]
    if (this.options.configPath) {
      args.unshift('--project', this.options.configPath)
    }
    if (this.options.extraArgs) {
      args.push(...this.options.extraArgs)
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

export class TypeScriptBuild extends TypeScriptTask {
  static description = 'compile TypeScript to JavaScript'

  taskArgs = []
}

export class TypeScriptWatch extends TypeScriptTask {
  static description = 'rebuild TypeScript project every file change'

  taskArgs = ['--watch']
}

export class TypeScriptTest extends TypeScriptTask {
  static description = 'type check TypeScript code'

  taskArgs = ['--noEmit']
}
