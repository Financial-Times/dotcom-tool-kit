import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { ServerlessSchema } from '@dotcom-tool-kit/types/lib/schema/serverless'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { getOptions } from '@dotcom-tool-kit/options'
import { spawn } from 'child_process'

export default class ServerlessDeploy extends Task<typeof ServerlessSchema> {
  static description = 'Deploys on AWS'

  async run(): Promise<void> {
    const { useVault, configPath, buildNumVariable, regions, systemCode } = this.options
    const buildNum = process.env[buildNumVariable]

    if (buildNum === undefined) {
      throw new ToolKitError(
        `the ${styles.task('ServerlessDeploy')} task requires the ${styles.code(
          `$${buildNumVariable}`
        )} environment variable to be defined`
      )
    }

    let vaultEnv = {}
    // HACK:20231124:IM We need to call Vault to check whether a project has
    // migrated to Doppler yet, and sync Vault secrets if it hasn't, but this
    // logic should be removed entirely once we drop support for Vault. We can
    // skip this call if we find the project has already added options for
    // doppler in the Tool Kit configuration.
    const migratedToolKitToDoppler = Boolean(getOptions('@dotcom-tool-kit/doppler')?.project)
    if (useVault && !migratedToolKitToDoppler) {
      const dopplerCi = new DopplerEnvVars(this.logger, 'ci')
      const vaultCi = await dopplerCi.fallbackToVault()
      // HACK:20231023:IM don't read secrets when the project has already
      // migrated from Vault to Doppler – Doppler will instead sync secrets to
      // Parameter Store for the Serverless config to reference
      if (!vaultCi.MIGRATED_TO_DOPPLER) {
        const dopplerEnvVars = new DopplerEnvVars(this.logger, 'prod')
        vaultEnv = await dopplerEnvVars.fallbackToVault()
      }
    }

    for (const region of regions) {
      this.logger.verbose('starting the child serverless process...')
      const args = [
        'deploy',
        '--region',
        region,
        '--stage',
        'prod',
        '--aws-profile',
        `CircleCI-role-${systemCode}`
      ]
      if (configPath) {
        args.push('--config', configPath)
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
}
