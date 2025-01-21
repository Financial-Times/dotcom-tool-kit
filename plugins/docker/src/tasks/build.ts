import { buildImageName, getImageTagsFromEnvironment } from '../image-info'
import { DockerSchema } from '@dotcom-tool-kit/schemas/lib/plugins/docker'
import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { spawn } from 'node:child_process'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default class DockerBuild extends Task<{
  plugin: typeof DockerSchema
}> {
  async run() {
    // Iterate over different image types like web, worker, etc
    for (const [imageIdentifier, imageOptions] of Object.entries(this.pluginOptions.images)) {
      const imageName = buildImageName(imageOptions)
      const imageTags = [
        imageName,
        ...getImageTagsFromEnvironment({
          ciState: readState('ci'),
          ...imageOptions
        })
      ]
      this.logger.info(`Building image "${imageIdentifier}": with tags ${imageTags.join(', ')}`)
      try {
        // We need to create a builder so that we're not limited to
        // building AMD64 images due to the platform our CircleCI
        // builds run on
        const childCreate = spawn('docker', [
          'buildx',
          'create',
          '--platform',
          imageOptions.platform,
          '--use' // This is a shortcut that prevents us having to run `docker buildx use`
        ])
        hookFork(this.logger, 'docker-build-create', childCreate)
        await waitOnExit('docker-build-create', childCreate)

        const childBuild = spawn('docker', [
          'buildx',
          'build',
          '--load', // Without this, the image is not stored and so we can't push it later
          '--platform',
          imageOptions.platform,
          ...imageTags.flatMap((tag) => ['--tag', tag]),
          '--file',
          imageOptions.definition,
          process.cwd()
        ])
        hookFork(this.logger, 'docker-build', childBuild)
        await waitOnExit('docker-build', childBuild)
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
