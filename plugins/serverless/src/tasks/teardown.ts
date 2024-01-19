import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { ServerlessSchema } from '@dotcom-tool-kit/types/lib/schema/serverless'
import { readState } from '@dotcom-tool-kit/state'
import { spawn } from 'child_process'

export default class ServerlessTeardown extends Task<typeof ServerlessSchema> {
  static description = 'Teardown existing serverless functions'

  async run(): Promise<void> {
		const { configPath, systemCode, regions } = this.options

		const reviewState = readState('review')

    if (!reviewState || !reviewState.stageName) {
      throw new ToolKitError(
        `Could not find state for review, check that ${styles.hook('deploy:review')} ran successfully`
      )
    }

    this.logger.verbose('starting the child serverless process...')

    const args = ['remove', '--region', regions[0], '--stage', reviewState.stageName, '--aws-profile', `CircleCI-role-${systemCode}`];
    if (configPath) {
      args.push('--config', './serverless.yml')
    }

    const child = spawn('serverless', args)

    hookFork(this.logger, 'serverless', child)

    await waitOnExit('serverless', child)
	}
}
