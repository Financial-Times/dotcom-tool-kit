import { z } from 'zod'

export const CircleCISchema = z.object({
  cimgNodeVersions: z
    .string()
    .array()
    .default(['18.19-browsers'])
    .describe(
      'list of CircleCI [Node.js image versions](https://circleci.com/developer/images/image/cimg/node) to use. if more than one is provided, a [matrix build](https://circleci.com/docs/using-matrix-jobs/) will be generated in your CircleCI config.'
    ),
  cypressImage: z
    .string()
    .optional()
    .describe(
      "the Cypress docker image to use. see https://github.com/cypress-io/cypress-docker-images for available images and tags. if this option is present, and you're using the [`circleci-deploy`](../circleci-deploy) plugin, this will override the default `node` executor for the `e2e-test-review` and `e2e-test-staging` jobs."
    )
})
export type CircleCIOptions = z.infer<typeof CircleCISchema>

export const Schema = CircleCISchema
