import { z } from 'zod'

export const CircleCISchema = z.object({
  cimgNodeVersions: z.string().array().default(['18.19-browsers'])
})
export type CircleCIOptions = z.infer<typeof CircleCISchema>

export const Schema = CircleCISchema
