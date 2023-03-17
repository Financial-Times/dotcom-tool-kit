import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { ServerlessSchema } from '@dotcom-tool-kit/types/lib/schema/serverless'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import { spawn } from 'child_process'

export default class ServerlessDeploy extends Task<typeof ServerlessSchema> {
  static description = 'Deploys on AWS'

  async run(): Promise<void> {
    const { useVault, configPath, buildNumVariable } = this.options
    const buildNum = process.env[buildNumVariable]

    if (buildNum === undefined) {
      throw new ToolKitError(
        `the ${styles.task('ServerlessDeploy')} task requires the ${styles.code(
          `$${buildNumVariable}`
        )} environment variable to be defined`
      )
    }

    let vaultEnv = {}
    if (useVault) {
      const vault = new VaultEnvVars(this.logger, {
        environment: 'production'
      })

      vaultEnv = await vault.get()
    }

    this.options.region.forEach((region) => {
      this.logger.verbose('starting the child serverless process...')
      const args = ['deploy', '--region', region, '--stage', 'prod']
      if (configPath) {
        args.push('--config', configPath)
      }

      const child = spawn('serverless', args, {
        env: {
          ...vaultEnv,
          ...process.env
        }
      })

      hookFork(this.logger, 'serverless', child)
    })
  }
}
