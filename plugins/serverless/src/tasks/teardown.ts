import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { readState } from '@dotcom-tool-kit/state'
import { spawn } from 'child_process'
import type ServerlessSchema from '../schema'

export default class ServerlessTeardown extends Task<{ plugin: typeof ServerlessSchema }> {
  static description = 'Tear down existing serverless functions'

  async run({ cwd }: TaskRunContext): Promise<void> {
    const { configPath, regions, systemCode } = this.pluginOptions

    const reviewState = readState('review')

    if (!reviewState || !reviewState.stageName) {
      throw new ToolKitError(
        `Could not find state for review, check that ${styles.hook('deploy:review')} ran successfully`
      )
    }

    this.logger.verbose('starting the child serverless process...')

    const args = [
      'remove',
      '--region',
      regions[0],
      '--stage',
      reviewState.stageName,
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
