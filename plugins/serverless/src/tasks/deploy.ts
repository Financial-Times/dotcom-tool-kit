import { ToolKitError } from '@dotcom-tool-kit/error'
import { hookFork, styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { ServerlessSchema } from '@dotcom-tool-kit/types/lib/schema/serverless'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import { spawn } from 'child_process'

export default class ServerlessDeploy extends Task<typeof ServerlessSchema> {
  static description = 'Deploys on AWS'

  async run(): Promise<void> {
    const { useVault, configPath, buildNumVariable, regions } = this.options
    const buildNum = process.env[buildNumVariable]

    if (buildNum === undefined) {
      throw new ToolKitError(
        `the ${styles.task('ServerlessDeploy')} task requires the ${styles.code(
          `$${buildNumVariable}`
        )} environment variable to be defined`
      )
    }

    let dopplerEnv = {}
    if (useVault) {
      const doppler = new DopplerEnvVars(this.logger, 'prd')

      dopplerEnv = await doppler.get()
    }

    regions.forEach((region) => {
      this.logger.verbose('starting the child serverless process...')
      const args = ['deploy', '--region', region, '--stage', 'prod']
      if (configPath) {
        args.push('--config', configPath)
      }

      const child = spawn('serverless', args, {
        env: {
          ...process.env,
          ...dopplerEnv
        }
      })

      hookFork(this.logger, 'serverless', child)
    })
  }
}
