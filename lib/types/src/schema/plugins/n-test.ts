import { z } from 'zod'

export const SmokeTestSchema = z.object({
  browsers: z.string().array().optional(),
  host: z.string().optional(),
  config: z.string().optional(),
  interactive: z.boolean().optional(),
  header: z.record(z.string()).optional()
})
export type SmokeTestOptions = z.infer<typeof SmokeTestSchema>

export const Schema = SmokeTestSchema
