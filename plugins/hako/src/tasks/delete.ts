import { spawn } from 'node:child_process'

import * as z from 'zod'

import { Task } from '@dotcom-tool-kit/base'
import { hookFork, waitOnExit, styles } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'

import { HakoEnvironmentName, hakoImageName, hakoRegions } from '../hako'
import { getAppDetails } from '../get-app-details'

const HakoDeleteSchema = z
  .object({
    appName: z
      .string()
      .describe(
        'name of the app with the ephemeral app to delete (will be the same as the name of the docker image)'
      ),
    asReviewApp: z
      .boolean()
      .default(false)
      .describe(
        'whether to delete a temporary review app. overrides the `ephemeralId` option with its own hash of the git branch.'
      ),
    ephemeralId: z
      .string()
      .optional()
      .describe('ID that is used by Hako to identify a particular ephemeral app'),
    environment: HakoEnvironmentName.describe('the Hako environment the ephemeral app is in')
  })
  .describe('Remove unneeded ephemeral app')

export { HakoDeleteSchema as schema }

export default class HakoDelete extends Task<{ task: typeof HakoDeleteSchema }> {
  async run() {
    const awsCredentials = readState('ci')?.awsCredentials ?? {}

    const awsRegion = hakoRegions[this.options.environment.region]

    const { subdomain } = getAppDetails({
      name: this.options.appName,
      ephemeralId: this.options.ephemeralId,
      asReviewApp: this.options.asReviewApp
    })

    this.logger.info(`Deleting ${styles.code(subdomain)} from Hako`)

    const child = spawn('docker', [
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
      'app',
      'delete',
      '--app',
      subdomain,
      '--env',
      this.options.environment.name
    ])

    hookFork(this.logger, 'hako-app-delete', child)
    await waitOnExit('hako-app-delete', child)
  }
}
