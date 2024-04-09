import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/base'
import { ServerlessSchema } from '@dotcom-tool-kit/schemas/lib/plugins/serverless'
import { spawn } from 'child_process'

export default class ServerlessDeploy extends Task<{ plugin: typeof ServerlessSchema }> {
  static description = 'Deploys on AWS'

  async run(): Promise<void> {
    const { configPath, regions, systemCode } = this.pluginOptions

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
        env: process.env
      })

      hookFork(this.logger, 'serverless', child)
      await waitOnExit('serverless', child)
    }
  }
}
