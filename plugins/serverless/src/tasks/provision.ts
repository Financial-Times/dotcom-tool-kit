import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { ServerlessSchema } from '@dotcom-tool-kit/types/lib/schema/serverless'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { spawn } from 'child_process'

export default class ServerlessProvision extends Task<typeof ServerlessSchema> {
  static description = 'Provisions a job on AWS'

  async run(): Promise<void> {
    const { useVault, configPath, buildNumVariable, systemCode, regions } = this.options
    const buildNum = process.env[buildNumVariable]

    if (buildNum === undefined) {
      throw new ToolKitError(
        `the ${styles.task('ServerlessProvision')} task requires the ${styles.code(
          `$${buildNumVariable}`
        )} environment variable to be defined`
      )
    }

    let dopplerEnv = {}
    if (useVault) {
      const doppler = new DopplerEnvVars(this.logger, 'dev')

      dopplerEnv = await doppler.get()
    }

    this.logger.verbose('starting the child serverless process...')
    const args = [
      'deploy',
      '--region',
      regions[0],
      '--stage',
      `ci${buildNum}`,
      '--aws-profile',
      `CircleCI-role-${systemCode}`
    ]
    if (configPath) {
      args.push('--config', './serverless.yml')
    }

    const child = spawn('serverless', args, {
      env: {
        ...process.env,
        ...dopplerEnv
      }
    })

    hookFork(this.logger, 'serverless', child)
  }
}
