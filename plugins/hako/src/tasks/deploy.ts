import { spawn } from 'child_process'
import { z } from 'zod'
import { hookFork, waitOnExit, styles } from '@dotcom-tool-kit/logger'
import { CIState, readState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

const hakoImageName = 'docker.packages.ft.com/financial-times-internal-releases/hako-cli:0.1.11-alpha'

const HakoEnvironmentNames = z.enum(['ft-com-prod-eu', 'ft-com-prod-us', 'ft-com-test-eu'])
type HakoEnvironmentNames = (typeof HakoEnvironmentNames.options)[number]

const HakoDeploySchema = z
  .object({
    environments: z.array(HakoEnvironmentNames).describe('the Hako environments to deploy an image to')
  })
  .describe('Deploy to ECS via the Hako CLI')

const hakoEnvironments: Record<HakoEnvironmentNames, string> = {
  'ft-com-prod-eu': 'eu-west-1',
  'ft-com-prod-us': 'us-east-1',
  'ft-com-test-eu': 'eu-west-1'
}

export { HakoDeploySchema as schema }

interface DeploymentOptions {
  awsCredentials: CIState['awsCredentials']
  environment: HakoEnvironmentNames
  name: string
  tag: string
}

export default class HakoDeploy extends Task<{ task: typeof HakoDeploySchema }> {
  async deployApp({ awsCredentials, environment, name, tag }: DeploymentOptions): Promise<void> {
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
      hakoImageName,
      'image',
      'deploy',
      '--image-name',
      name,
      '--image-tag',
      tag,
      '--app',
      name, // NOTE: the app name MUST match the image name (for now)
      '--env',
      environment
    ])
    hookFork(this.logger, 'hako-deploy', child)
    await waitOnExit('hako-deploy', child)
  }

  async run() {
    this.logger.info('Deploying to Hako')
    try {
      const awsCredentials = readState('ci')?.awsCredentials ?? {}
      const pushedImages = readState('docker')?.pushedImages ?? []
      const deployEnvironments = this.options.environments

      if (!awsCredentials.accessKeyId || !awsCredentials.secretAccessKey || !awsCredentials.sessionToken) {
        throw new Error(
          `no AWS credentials found, use ${styles.plugin('@dotcom-tool-kit/aws')} and ${styles.task(
            'AwsAssumeRole'
          )} before deploying with hako`
        )
      }

      if (!pushedImages.length) {
        throw new Error(
          `no Docker images have been built and pushed, use ${styles.plugin(
            '@dotcom-tool-kit/docker'
          )} before deploying with hako`
        )
      }

      this.logger.info('Pulling hako-cli image')

      const child = spawn('docker', ['pull', '--platform', 'linux/amd64', hakoImageName])

      hookFork(this.logger, 'hako-pull', child)
      await waitOnExit('hako-pull', child)

      // store the async promises and promise.all() once for-loop completes
      const deploys: Promise<void>[] = []

      for (const { name, tag } of pushedImages) {
        for (const environment of deployEnvironments) {
          deploys.push(this.deployApp({ awsCredentials, environment, name, tag }))
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
