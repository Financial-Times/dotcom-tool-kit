import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import { glob } from 'glob'
import { MochaSchema } from '@dotcom-tool-kit/schemas/tasks/mocha.js'
import { fork } from 'child_process'
import { fileURLToPath } from 'url'
import { promisify } from 'util'
const mochaCLIPath = fileURLToPath(import.meta.resolve('mocha/bin/mocha'))

export default class Mocha extends Task<{ task: typeof MochaSchema }> {
  async run(): Promise<void> {
    const files = await promisify(glob)(this.options.files)

    const args = ['--color', ...files]
    if (this.options.configPath) {
      args.unshift(`--config=${this.options.configPath}`)
    }
    this.logger.info(`running mocha ${args.join(' ')}`)
    const child = fork(mochaCLIPath, args, { silent: true })
    hookFork(this.logger, 'mocha', child)
    return waitOnExit('mocha', child)
  }
}
