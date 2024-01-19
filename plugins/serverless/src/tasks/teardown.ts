import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { ServerlessSchema } from '@dotcom-tool-kit/types/lib/schema/serverless'
import { spawn } from 'child_process'

export default class ServerlessTeardown extends Task<typeof ServerlessSchema> {
  static description = 'Teardown existing serverless functions'

  async run(): Promise<void> {
		const { configPath, buildNumVariable, systemCode, regions } = this.options
    const buildNum = process.env[buildNumVariable]

		if (buildNum === undefined) {
      throw new ToolKitError(
        `the ${styles.task('ServerlessTeardown')} task requires the ${styles.code(
          `$${buildNumVariable}`
        )} environment variable to be defined`
      )
    }

    this.logger.verbose('starting the child serverless process...')

    const args = ['remove', '--region', regions[0], '--stage', `ci${buildNum}`, '--aws-profile', `CircleCI-role-${systemCode}`];
    if (configPath) {
      args.push('--config', './serverless.yml')
    }

    const child = spawn('serverless', args)

    hookFork(this.logger, 'serverless', child)

    await waitOnExit('serverless', child)
	}
}
