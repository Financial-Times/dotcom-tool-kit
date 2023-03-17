import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { ServerlessSchema } from '@dotcom-tool-kit/types/lib/schema/serverless'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import { spawn } from 'child_process'

export default class ServerlessProvision extends Task<typeof ServerlessSchema> {
  static description = 'Provisions a job on AWS'

  async run(): Promise<void> {
    const { useVault, configPath } = this.options
    const buildNum = process.env[this.options.buildNumVariable]

    if (buildNum === undefined) {
      throw new ToolKitError(
        `the ${styles.task('ServerlessProvision')} task requires the ${styles.code(
          `$${this.options.buildNumVariable}`
        )} environment variable to be defined`
      )
    }

    let vaultEnv = {}
    if (useVault) {
      const vault = new VaultEnvVars(this.logger, {
        environment: 'development'
      })

      vaultEnv = await vault.get()
    }

    this.logger.verbose('starting the child serverless process...')
    const args = [
      'deploy',
      '--region',
      this.options.region[0],
      '--stage',
      `ci${buildNum}`,
      '--aws-profile',
      `CircleCI-role-${this.options.systemCode}`
    ]
    if (configPath) {
      args.push('--config', './serverless.yml')
    }

    const child = spawn('serverless', args, {
      env: {
        ...vaultEnv,
        ...process.env
      }
    })

    hookFork(this.logger, 'serverless', child)
  }
}
