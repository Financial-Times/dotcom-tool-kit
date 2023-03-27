import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { glob } from 'glob'
import { MochaSchema } from '@dotcom-tool-kit/types/lib/schema/mocha'
import { fork } from 'child_process'
import { promisify } from 'util'
const mochaCLIPath = require.resolve('mocha/bin/mocha')

export default class Mocha extends Task<typeof MochaSchema> {
  static description = ''

  async run(): Promise<void> {
    const files = await promisify(glob)(this.options.files)

    const args = ['--color', this.options.configPath ? `--config=${this.options.configPath}` : '', ...files]
    this.logger.info(`running mocha ${args.join(' ')}`)
    const child = fork(mochaCLIPath, args, { silent: true })
    hookFork(this.logger, 'mocha', child)
    return waitOnExit('mocha', child)
  }
}
