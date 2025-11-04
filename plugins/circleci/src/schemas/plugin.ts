import { styles as s } from '@dotcom-tool-kit/logger'
import * as z from 'zod'

export default z
  .object({
    cimgNodeVersions: z
      .string()
      .array()
      .default(['20.19-browsers'])
      .describe(
        'list of CircleCI [Node.js image versions](https://circleci.com/developer/images/image/cimg/node) to use. if more than one is provided, a [matrix build](https://circleci.com/docs/using-matrix-jobs/) will be generated in your CircleCI config.'
      ),
    cypressImage: z
      .string()
      .optional()
      .describe(
        "the Cypress docker image to use. see https://github.com/cypress-io/cypress-docker-images for available images and tags. if this option is present, and you're using the [`circleci-deploy`](../circleci-deploy) plugin, this will override the default `node` executor for the `e2e-test-review` and `e2e-test-staging` jobs."
      ),
    tagFilter: z
      .string()
      .or(z.literal(false))
      .default(/^v\d+\.\d+\.\d+(-.+)?/.toString())
      .describe(
        "the regular expression used to match tags for jobs that should run on tag workflows. by default, matches tags that look like `v1.2.3`; if your releases use a different tag format, change this option to match your tags. set to `false` to prevent running workflows on tags, for example if your repo doesn't do versioned releases."
      )
  })
  .passthrough()
  .refine((options) => !('nodeVersion' in options), {
    message: `the option ${s.code('nodeVersion')} has been replaced by ${s.code('cimgNodeVersions')}`
  })
  .refine((options) => !('tagFilterRegex' in options), {
    message: `the option ${s.code('tagFilterRegex')} has been replaced by ${s.code('tagFilter')}`
  })
  .refine((options) => !('runOnTag' in options), {
    message: `the option ${s.code('runOnTag')} has been replaced by ${s.code('tagFilter: false')}`
  })
