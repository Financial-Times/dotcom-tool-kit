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
    buildArgs: z
      .record(z.string(), z.string())
      .default({})
      .describe(
        'An object of Docker [build variables](https://docs.docker.com/build/building/variables/) to include when building the image. To use values from Tool Kit\'s environment (since we usually build Docker images on CircleCI, this would be the CI environment), you can use the `!toolkit/env` tag, e.g. `buildArgs: { GIT_COMMIT: !toolkit/env "GIT_COMMIT" }`'
      ),
    secrets: z
      .array(
        z.union([
          z.string(),
          z.object({
            id: z.string(),
            type: z.union([z.literal('file'), z.literal('env')]).optional(),
            source: z.string().optional()
          })
        ])
      )
      .default([])
      .describe(
        `
          An array of Docker [secrets](https://docs.docker.com/build/building/secrets/) to include when building the image.
          Each item in the array will add \`--secret id=[id],source=[source]\` to the docker build script. Docker can embed
          secret environment variables such as \`NPM_TOKEN\` (type: env) and secret files such as \`.npmrc\` (type: file)\`.
          You can also include a secret environment variable by adding an item with just the environment name.
        `
      )
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

        const buildArgs = Object.entries(this.options.buildArgs).flatMap(([key, value]) => {
          return ['--build-arg', `${key}=${value}`]
        })

        const secrets = this.options.secrets.flatMap((secret) => {
          const secretArg = ['--secret']

          if (typeof secret === 'string') {
            secretArg.push(`id=${secret}`)
          } else {
            secretArg.push(Array.from(Object.entries(secret), ([key, value]) => `${key}=${value}`).join(','))
          }

          return secretArg
        })

        const childBuild = spawn('docker', [
          'buildx',
          'build',
          '--load', // Without this, the image is not stored and so we can't push it later
          ...buildArgs,
          ...secrets,
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
