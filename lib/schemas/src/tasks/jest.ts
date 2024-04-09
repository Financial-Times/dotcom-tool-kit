import { z } from 'zod'

export const JestSchema = z.object({
  configPath: z.string().optional(),
  ci: z.literal(true).optional()
})

export type JestOptions = z.infer<typeof JestSchema>

export const Schema = JestSchema
