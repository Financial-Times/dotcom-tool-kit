import * as z from 'zod'

const DockerImageSchema = z.object({
  definition: z
    .string()
    .default('Dockerfile')
    .describe('The path to the Dockerfile definition file for this image'),
  platform: z
    .string()
    .default('linux/arm64')
    .describe('The platform to target when building the Docker image, e.g. linux/arm64 or linux/amd64'),
  registry: z
    .string()
    .default('docker.packages.ft.com/cp-container-registry')
    .describe('The registry that the Docker image is pushed to, excluding name and tag'),
  name: z
    .string()
    .regex(/^[a-z][a-z-]+$/, 'Image name must only contain lowercase alphabetic characters and hyphens')
    .describe('The name of the image, excluding a tag')
})

export default z.object({
  images: z.record(z.string(), DockerImageSchema)
})
