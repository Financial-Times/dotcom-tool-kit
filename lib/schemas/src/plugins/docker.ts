import { z } from 'zod'

const DockerRegistrySchema = z.object({
  name: z
    .string()
    .describe('The registry name/tag to push to, e.g. docker.packages.ft.com/cp-container-registry/myapp:latest'),
  stage: z
    .string()
    .describe(
      'The stage that this registry is used for. E.g. "production", "staging". This is combined with a task option for DockerPush'
    )
})

const DockerImageSchema = z.object({
  definition: z
    .string()
    .default('Dockerfile')
    .describe('The path to the Dockerfile definition file for this image'),
  platform: z
    .string()
    .default('linux/amd64')
    .describe('The platform to target when building the Docker image, e.g. linux/amd64 or linux/arm64'),
  registries: z
    .array(DockerRegistrySchema)
    .describe('The registries that the Docker image can be pushed to at different deploy stages')
})

export const DockerSchema = z.object({
  images: z.record(z.string(), DockerImageSchema)
})

export type DockerOptions = z.infer<typeof DockerSchema>

export const Schema = DockerSchema
