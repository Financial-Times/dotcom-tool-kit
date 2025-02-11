import { fork } from 'child_process'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'

const commitlintCLIPath = require.resolve('.bin/commitlint')

export default class Commitlint extends Task {
  static description = 'Lint commit messages.'

  async run({ cwd }: TaskRunContext): Promise<void> {
    const child = fork(commitlintCLIPath, ['--edit'], { silent: true, cwd })
    hookFork(this.logger, 'commitlint', child)
    return waitOnExit('commitlint', child)
  }
}
