import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles, waitOnExit } from '@dotcom-tool-kit/logger'
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

    let vaultEnv = {}
    if (useVault) {
      const dopplerCi = new DopplerEnvVars(this.logger, 'ci')
      const vaultCi = await dopplerCi.fallbackToVault()
      // HACK:20231023:IM don't read secrets when the project has already
      // migrated from Vault to Doppler – Doppler will instead sync secrets to
      // Parameter Store for the Serverless config to reference
      if (!vaultCi.MIGRATED_TO_DOPPLER) {
        const dopplerEnvVars = new DopplerEnvVars(this.logger, 'dev')
        vaultEnv = await dopplerEnvVars.fallbackToVault()
      }
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
        ...vaultEnv
      }
    })

    hookFork(this.logger, 'serverless', child)
    await waitOnExit('serverless', child)
  }
}
