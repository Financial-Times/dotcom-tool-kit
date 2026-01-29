import { buildImageName, generateImageLabels, getDeployTag } from '../image-info'
import DockerSchema from '../schema'

import * as z from 'zod'

import { hookFork, waitOnExit } from '@dotcom-tool-kit/logger'
import { readState } from '@dotcom-tool-kit/state'
import { spawn } from 'node:child_process'
import { Task } from '@dotcom-tool-kit/base'
import { ToolKitError } from '@dotcom-tool-kit/error'

const DockerBuildSchema = z
  .object({
    ssh: z
      .boolean()
      .default(false)
      .describe(
        "whether to forward host's SSH agent, see https://docs.docker.com/reference/cli/docker/buildx/build/#ssh"
      ),
    buildArgs: z.record(z.string(), z.string()).describe('BuildArgs key/value pair')
  })
  .describe('Run `docker build` to create Docker images.')
export { DockerBuildSchema as schema }

export default class DockerBuild extends Task<{
  plugin: typeof DockerSchema
  task: typeof DockerBuildSchema
}> {
  async run() {
    // Iterate over different image types like web, worker, etc
    for (const [imageIdentifier, imageOptions] of Object.entries(this.pluginOptions.images)) {
      const imageName = imageOptions.name
      const fullImageName = buildImageName(imageOptions)
      const deployTag = getDeployTag(readState('ci'))
      this.logger.info(`Building image "${imageIdentifier}" with tag "${deployTag}"`)
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

        const labels = Object.entries(generateImageLabels(imageName))
          .filter(([, value]) => value)
          .flatMap(([label, value]) => {
            return ['--label', `${label}=${value}`]
          })

        const childBuild = spawn('docker', [
          'buildx',
          'build',
          '--load', // Without this, the image is not stored and so we can't push it later
          '--build-args',
          '--platform',
          imageOptions.platform,
          ...(this.options.ssh ? ['--ssh', 'default'] : []),
          '--tag',
          `${fullImageName}:${deployTag}`,
          ...labels,
          '--file',
          imageOptions.definition,
          process.cwd()
        ])
        hookFork(this.logger, 'docker-build', childBuild)
        await waitOnExit('docker-build', childBuild)
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
}
