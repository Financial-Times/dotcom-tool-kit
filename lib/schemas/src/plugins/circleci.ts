import { z } from 'zod'
import { styles as s } from '@dotcom-tool-kit/logger'

export const CircleCISchema = z
  .object({
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
      ),
    tagFilterRegex: z
      .string()
      .default(/^v\d+\.\d+\.\d+(-.+)?/.toString())
      .describe(
        'the regular expression used to match tags for jobs that should run on tag workflows. by default, matches tags that look like `v1.2.3`; if your releases use a different tag format, change this option to match your tags.'
      )
  })
  .refine((options) => !('nodeVersion' in options), {
    message: `the option ${s.code('nodeVersion')} has been replaced by ${s.code('cimgNodeVersions')}`
  })

export type CircleCIOptions = z.infer<typeof CircleCISchema>

export const Schema = CircleCISchema
