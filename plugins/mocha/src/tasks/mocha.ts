import { fork } from 'child_process'
import { promisify } from 'util'

import { glob } from 'glob'

import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import { type MochaSchema } from '@dotcom-tool-kit/schemas/lib/plugins/mocha'
const mochaCLIPath = require.resolve('mocha/bin/mocha')

export default class Mocha extends Task<{ plugin: typeof MochaSchema }> {
  static description = ''

  async run(): Promise<void> {
    const files = await promisify(glob)(this.pluginOptions.files)

    const args = ['--color', ...files]
    if (this.pluginOptions.configPath) {
      args.unshift(`--config=${this.pluginOptions.configPath}`)
    }
    this.logger.info(`running mocha ${args.join(' ')}`)
    const child = fork(mochaCLIPath, args, { silent: true })
    hookFork(this.logger, 'mocha', child)
    return waitOnExit('mocha', child)
  }
}
