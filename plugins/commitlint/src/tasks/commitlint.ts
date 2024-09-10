import { fork } from 'child_process'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'

const commitlintCLIPath = require.resolve('.bin/commitlint')

module.exports = class Commitlint extends Task {
  async run(): Promise<void> {
    const child = fork(commitlintCLIPath, ['--edit'], { silent: true })
    hookFork(this.logger, 'commitlint', child)
    return waitOnExit('commitlint', child)
  }
}
