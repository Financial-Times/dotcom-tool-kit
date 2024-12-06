import { z } from 'zod'

export const DockerPushSchema = z
  .object({
    stage: z
      .string()
      .describe(
        'The stage to push, e.g. "production", "staging". This restricts the images from the plugin config that will be pushed to those that share the same stage'
      )
  })
  .describe('Push a built Docker image to a registry.')

export type DockerPushOptions = z.infer<typeof DockerPushSchema>

export const Schema = DockerPushSchema
