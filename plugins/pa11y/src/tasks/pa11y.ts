import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import type { Pa11ySchema } from '@dotcom-tool-kit/schemas/lib/plugins/pa11y'
import { fork } from 'child_process'
import { readState } from '@dotcom-tool-kit/state'

const pa11yCIPath = require.resolve('pa11y-ci/bin/pa11y-ci')

export default class Pa11y extends Task<typeof Pa11ySchema> {
  static description = ''

  async run(): Promise<void> {
    const reviewState = readState('review')
    if (reviewState) {
      process.env.TEST_URL = `https://${reviewState.appName}.herokuapp.com`
    }

    const args = this.options.configFile ? ['--config', this.options.configFile] : []

    this.logger.info(`running pa11y-ci ${args.join(' ')}`)
    const child = fork(pa11yCIPath, args, { silent: true })
    hookFork(this.logger, 'pa11y', child)
    return waitOnExit('pa11y-ci', child)
  }
}
