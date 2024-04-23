import { z } from 'zod'

export const CircleCISchema = z.object({
  cimgNodeVersions: z
    .string()
    .array()
    .default(['18.19-browsers'])
    .describe(
      'list of CircleCI [Node.js image versions](https://circleci.com/developer/images/image/cimg/node) to use. if more than one is provided, a [matrix build](https://circleci.com/docs/using-matrix-jobs/) will be generated in your CircleCI config.'
    )
})
export type CircleCIOptions = z.infer<typeof CircleCISchema>

export const Schema = CircleCISchema
