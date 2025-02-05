import { spawn } from 'child_process'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { HakoDeploySchema } from '@dotcom-tool-kit/schemas/lib/tasks/hako-deploy'
import { stderr } from 'process'

const hakoEnvironments: Record<string, string | undefined> = {
  'ft-com-prod-eu': 'eu-west-1',
  'ft-com-prod-us': 'us-east-1',
  'ft-com-test-eu': 'eu-west-1'
}

export default class HakoDeploy extends Task<{ task: typeof HakoDeploySchema }> {
  async run() {
    this.logger.info('Deploying to Hako')
    try {
      const ciState = readState('ci')
      const awsCredentials = ciState?.awsCredentials || {}
      const pushedImages = ciState?.pushedImages || []
      const deployEnvironments = this.options.environments

      if (!awsCredentials.accessKeyId || !awsCredentials.secretAccessKey || !awsCredentials.sessionToken) {
        throw new Error(
          'no AWS credentials found, use "@dotcom-tool-kit/aws" and AwsAssumeRole before deploying with hako'
        )
      }

      if (!pushedImages.length) {
        throw new Error(
          'no Docker images have been built and pushed, use "@dotcom-tool-kit/docker" before deploying with hako'
        )
      }

      for (const environment of deployEnvironments) {
        if (!hakoEnvironments[environment]) {
          throw new Error(
            `hako environment "${environment}" does not exist, use one of ${Object.keys(
              hakoEnvironments
            ).join(', ')}`
          )
        }
      }

      this.logger.info('Pulling hako-cli image')

      const child = spawn('docker', [
        'pull',
        '--platform',
        'linux/amd64',
        'docker.packages.ft.com/financial-times-internal-releases/hako-cli:0.1.7-alpha'
      ])

      hookFork(this.logger, 'hako-pull', child)
      await waitOnExit('hako-pull', child)

      // store the async promises and promise.all() once for-loop completes
      const deploys: Promise<void>[] = []

      for (const { name, tag } of pushedImages) {
        for (const environment of deployEnvironments) {
          this.logger.info(`Deploying image "${name}" with tag "${tag}" to environment "${environment}"`)
          const awsRegion = hakoEnvironments[environment]
          const child = spawn('docker', [
            'run',
            '--env',
            `AWS_REGION=${awsRegion}`,
            '--env',
            `AWS_ACCESS_KEY_ID=${awsCredentials.accessKeyId}`,
            '--env',
            `AWS_SECRET_ACCESS_KEY=${awsCredentials.secretAccessKey}`,
            '--env',
            `AWS_SESSION_TOKEN=${awsCredentials.sessionToken}`,
            '--platform',
            'linux/amd64',
            'docker.packages.ft.com/financial-times-internal-releases/hako-cli:0.1.7-alpha',
            'image',
            'deploy',
            '--image-name',
            name,
            '--image-tag',
            tag,
            '--image-port',
            '3001',
            '--app',
            name, // NOTE: the app name MUST match the image name (for now)
            '--env',
            environment
          ])
          hookFork(this.logger, 'hako run', child)
          deploys.push(waitOnExit('hako run', child))
        }
      }

      await Promise.all(deploys)
    } catch (err) {
      if (err instanceof Error) {
        const error = new ToolKitError('hako deploy failed to run')
        error.details = err.message
        throw error
      } else {
        throw err
      }
    }
  }
}
