import { spawn } from 'child_process'
import { z } from 'zod/v3'
import { hookFork, waitOnExit, styles } from '@dotcom-tool-kit/logger'
import { CIState, readState, writeState } from '@dotcom-tool-kit/state'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { createHash } from 'node:crypto'

import { HakoEnvironment, HakoEnvironmentName, hakoDomains, hakoImageName, hakoRegions } from '../hako'
// HACK:IM:20250528 reexport this function from the shared library to maintain
// backwards-compatibility as the docker plugin schema depends on it being here
// oops
export { HakoEnvironmentName }

const HakoDeploySchema = z
  .object({
    asReviewApp: z
      .boolean()
      .default(false)
      .describe(
        'whether to deploy as a temporary review app, used for code review. overrides the `customEphemeralId` option with its own hash of the git branch.'
      ),
    customEphemeralId: z
      .string()
      .optional()
      .describe('ID that is used by Hako to identify a particular ephemeral app'),
    customEphemeralManifest: z
      .string()
      .optional()
      .describe(
        'path to another app.yaml manifest used to set custom parameters for an ephemeral app. if not set the manifest from the default path for the given environment will be used.'
      ),
    environments: z.array(HakoEnvironmentName).describe('the Hako environments to deploy an image to')
  })
  .describe('Deploy to ECS via the Hako CLI')

export { HakoDeploySchema as schema }

interface DeploymentOptions {
  awsCredentials: CIState['awsCredentials']
  environment: HakoEnvironment
  name: string
  tag: string
}

export default class HakoDeploy extends Task<{ task: typeof HakoDeploySchema }> {
  async deployApp({ awsCredentials, environment, name, tag }: DeploymentOptions): Promise<void> {
    this.logger.info(`Deploying image "${name}" with tag "${tag}" to environment "${environment.name}"`)
    const awsRegion = hakoRegions[environment.region]
    const commandArgs = [
      'run',
      '--interactive',
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
      environment.name
    ]
    const domain = hakoDomains[environment.stage]

    let reviewAppHash
    if (this.options.asReviewApp) {
      if (!process.env.CIRCLE_BRANCH) {
        throw new Error(
          `CIRCLE_BRANCH environment variable not found. This is required to create a review app`
        )
      }
      reviewAppHash = createHash('sha256').update(process.env.CIRCLE_BRANCH).digest('hex').slice(0, 6)
      writeState('review', { url: `https://${name}-${reviewAppHash}.${awsRegion}.${domain}` })
    }

    const ephemeralId = reviewAppHash ?? this.options.customEphemeralId
    if (ephemeralId) {
      commandArgs.push('--ephemeral', '--ephemeral-id', ephemeralId)
    } else {
      writeState('staging', { url: `https://${name}.${awsRegion}.${domain}` })
    }

    const child = spawn('docker', commandArgs)

    // Because we can't mount volumes in Docker images on CircleCI we have to
    // pass the hako config via stdin. This is only required for ephemeral apps
    // as typical deployments will use the options from the already-created
    // app.
    if (ephemeralId) {
      const hakoConfigPath =
        this.options.customEphemeralManifest ??
        join('hako-config', 'apps', name, environment.name, 'app.yaml')
      const absoluteHakoConfigPath = resolve(hakoConfigPath)
      try {
        const hakoConfig = await readFile(absoluteHakoConfigPath, 'utf-8')
        child.stdin.setDefaultEncoding('utf-8')
        child.stdin.write(hakoConfig)
      } catch (error) {
        child.kill('SIGTERM')
        throw new Error(`Hako config not found at ${absoluteHakoConfigPath}`)
      }
    }
    child.stdin.end()
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
      // We wrap non-ToolKitError errors to ensure that they exit the process
      if (err instanceof Error && !(err instanceof ToolKitError)) {
        const error = new ToolKitError(err.message)
        error.exitCode = 1
        throw error
      }
      throw err
    }
  }
}
