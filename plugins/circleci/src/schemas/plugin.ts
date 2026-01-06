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
    tagFilter: z
      .string()
      .or(z.literal(false))
      .default(/^v\d+\.\d+\.\d+(-.+)?/.toString())
      .describe(
        "the regular expression used to match tags for jobs that should run on tag workflows. by default, matches tags that look like `v1.2.3`; if your releases use a different tag format, change this option to match your tags. set to `false` to prevent running workflows on tags, for example if your repo doesn't do versioned releases."
      ),
    checkoutMethod: CheckoutMethod.optional().describe(
      "whether to checkout the full git repository or blobless (without files unrelated to the main commit.) blobless checkouts are the default and are faster, though some projects may encounter issues if they rely on inspecting files in the git history. if you see logs like `The authenticity of host 'github.com (140.82.113.4)' can't be established.` you should try enabling full checkouts."
    ),
    orbDevVersion: z
      .string()
      .regex(/^dev:/)
      .optional()
      .describe(
        'set this option to use a [development version](https://circleci.com/docs/orbs/author/orb-concepts/#development-orbs) of the Tool Kit CircleCI orb in the generated config'
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
