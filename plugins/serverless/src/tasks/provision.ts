import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { spawn } from 'child_process'
import { readState, writeState } from '@dotcom-tool-kit/state'
import type ServerlessSchema from '../schema'

export default class ServerlessProvision extends Task<{ plugin: typeof ServerlessSchema }> {
  static description = 'Provision a review serverless function'

  async run({ cwd }: TaskRunContext): Promise<void> {
    const { configPath, systemCode, regions } = this.pluginOptions
    const ciState = readState('ci')

    if (!ciState) {
      throw new ToolKitError(
        `the ${styles.task(
          'ServerlessDeploy'
        )} should be run in CI, but no CI state was found. check you have a plugin installed that initialises the CI state.`
      )
    }

    const buildNum = ciState?.buildNumber

    if (!buildNum) {
      const error = new ToolKitError(
        `the ${styles.task('ServerlessDeploy')} requires a CI build number in the CI state.`
      )

      error.details = `this is provided by plugins such as ${styles.plugin(
        'circleci'
      )}, which populates it from the CIRCLE_BUILD_NUM environment variable.`
    }

    const stageName = `ci${buildNum}`

    this.logger.verbose('starting the child serverless process...')
    const args = [
      'deploy',
      '--region',
      regions[0],
      '--stage',
      stageName,
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
    writeState('review', {
      stageName
    })
  }
}
