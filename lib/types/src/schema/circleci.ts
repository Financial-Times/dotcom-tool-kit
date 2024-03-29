import { z } from 'zod'

export const CircleCISchema = z.object({
  nodeVersion: z.string().or(z.string().array()).default('16.14-browsers'),
  cypressImage: z.string().optional()
})
export type CircleCIOptions = z.infer<typeof CircleCISchema>

export const Schema = CircleCISchema
