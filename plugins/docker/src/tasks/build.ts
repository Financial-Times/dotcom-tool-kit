import { buildImageName } from '../build-image-name'
import { DockerSchema } from '@dotcom-tool-kit/schemas/lib/plugins/docker'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { spawn } from 'node:child_process'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class DockerBuild extends Task<{
  plugin: typeof DockerSchema
}> {
  async run() {
    // Iterate over different image types like web, worker, etc
    for (const [imageIdentifier, imageOptions] of Object.entries(this.pluginOptions.images)) {
      this.logger.info(`Building image "${imageIdentifier}"`)
      try {
        const child = spawn('docker', [
          'build',
          '--platform',
          imageOptions.platform,
          '--tag',
          buildImageName(imageOptions),
          '--file',
          imageOptions.definition,
          process.cwd()
        ])
        hookFork(this.logger, 'dockerBuild', child)
        await waitOnExit('dockerBuild', child)
      } catch (err) {
        if (err instanceof Error) {
          const error = new ToolKitError('docker build failed to run')
          error.details = err.message
          throw error
        } else {
          throw err
        }
      }
    }
  }
}
