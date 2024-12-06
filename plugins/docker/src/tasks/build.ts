import { DockerSchema } from '@dotcom-tool-kit/schemas/lib/plugins/docker'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { spawn } from 'child_process'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class DockerBuild extends Task<{
  plugin: typeof DockerSchema
}> {
  async run() {
    for (const [imageIdentifier, options] of Object.entries(this.pluginOptions.images)) {
      this.logger.info(`Building image "${imageIdentifier}"`)
      try {
        const child = spawn('docker', [
          'build',
          '--platform',
          options.platform,
          '--tag',
          imageIdentifier,
          '--file',
          options.definition,
          process.cwd()
        ])
        hookFork(this.logger, 'docker', child)
        await waitOnExit('docker', child)
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
