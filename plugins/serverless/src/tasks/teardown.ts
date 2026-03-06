import { hookFork, styles, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { readState } from '@dotcom-tool-kit/state'
import { spawn } from 'child_process'
import type ServerlessSchema from '../schema'
import { createHash } from 'crypto'

export default class ServerlessTeardown extends Task<{ plugin: typeof ServerlessSchema }> {
  static description = 'Tear down existing serverless functions'

  async run({ cwd }: TaskRunContext): Promise<void> {
    const { configPath, regions, systemCode } = this.pluginOptions

    const ciState = readState('ci')

    if (!ciState) {
      throw new Error(
        `Couldn't get CI state to generate the hashed branch name. Make sure this task is running in CI and you have a Tool Kit plugin that provides CI state, such as ${styles.plugin(
          '@dotcom-tool-kit/circleci'
        )}, installed.`
      )
    }

    const hash = createHash('sha256').update(ciState.branch).digest('hex').slice(0, 6)

    this.logger.verbose('starting the child serverless process...')

    const args = [
      'remove',
      '--region',
      regions[0],
      '--stage',
      hash,
      '--aws-profile',
      `CircleCI-role-${systemCode}`
    ]
    if (configPath) {
      args.push('--config', './serverless.yml')
    }

    const child = spawn('serverless', args, {
      env: process.env,
      cwd
    })

    hookFork(this.logger, 'serverless', child)

    await waitOnExit('serverless', child)
  }
}
