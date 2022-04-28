import { Task } from '@dotcom-tool-kit/types'
import { fork } from 'child_process'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'

const secretSquirrelPath = require.resolve('.bin/secret-squirrel')

export default class SecretSquirrel extends Task {
  static description = 'run Secret Squirrel to check for secrets in your repo'

  async run(): Promise<void> {
    this.logger.info('running secret-squirrel')

    const child = await fork(secretSquirrelPath, [], { silent: true })
    hookFork(this.logger, 'secret-squirrel', child)
    return waitOnExit('secret-squirrel', child)
  }
}
