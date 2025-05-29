import { buildImageName, getDeployTag } from '../image-info'
import DockerSchema from '../schema'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { spawn } from 'node:child_process'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState, writeState } from '@dotcom-tool-kit/state'

export default class DockerPush extends Task<{
  plugin: typeof DockerSchema
}> {
  async run() {
    const pushedImages = []

    // Iterate over different image types like web, worker, etc
    for (const [imageIdentifier, imageOptions] of Object.entries(this.pluginOptions.images)) {
      try {
        const imageName = buildImageName(imageOptions)
        this.logger.info(`Pushing image "${imageIdentifier}" to ${imageName}`)
        const child = spawn('docker', ['push', '--all-tags', imageName])
        hookFork(this.logger, 'docker-push', child)
        await waitOnExit('docker-push', child)
        pushedImages.push({
          name: imageOptions.name,
          tag: getDeployTag(readState('ci')),
          fullyQualifiedName: imageName
        })
      } catch (err) {
        if (err instanceof Error) {
          const error = new ToolKitError('docker push failed to run')
          error.details = err.message
          error.exitCode = 1
          throw error
        } else {
          throw err
        }
      }
    }

    writeState('docker', { pushedImages })
  }
}
