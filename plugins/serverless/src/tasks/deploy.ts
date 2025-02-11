import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { Task, TaskRunContext } from '@dotcom-tool-kit/base'
import { spawn } from 'child_process'
import type ServerlessSchema from '../schema'

export default class ServerlessDeploy extends Task<{ plugin: typeof ServerlessSchema }> {
  static description = 'Deploy a serverless function'

  async run({ cwd }: TaskRunContext): Promise<void> {
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
        env: process.env,
        cwd
      })

      hookFork(this.logger, 'serverless', child)
      await waitOnExit('serverless', child)
    }
  }
}
