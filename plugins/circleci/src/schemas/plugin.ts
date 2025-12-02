import { styles as s } from '@dotcom-tool-kit/logger'
import * as z from 'zod'

const CheckoutMethod = z.enum(['full', 'blobless'])
export type CheckoutMethod = z.infer<typeof CheckoutMethod>

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
    runOnTag: z
      .boolean()
      .default(true)
      .describe(
        "whether you want to run any workflow jobs when a tag is created. you may want to disable this if you don't do versioned releases and you want to keep the generated config simple."
      ),
    tagFilterRegex: z
      .string()
      .default(/^v\d+\.\d+\.\d+(-.+)?/.toString())
      .describe(
        'the regular expression used to match tags for jobs that should run on tag workflows. by default, matches tags that look like `v1.2.3`; if your releases use a different tag format, change this option to match your tags.'
      ),
    checkoutMethod: CheckoutMethod.optional().describe(
      "whether to checkout the full git repository or blobless (without files unrelated to the main commit.) blobless checkouts are the default and are faster, though some projects may encounter issues if they rely on inspecting files in the git history. if you see logs like `The authenticity of host 'github.com (140.82.113.4)' can't be established.` you should try enabling full checkouts."
    )
  })
  .passthrough()
  .refine((options) => !('nodeVersion' in options), {
    message: `the option ${s.code('nodeVersion')} has been replaced by ${s.code('cimgNodeVersions')}`
  })
