import { z } from 'zod'

export const JestSchema = z.object({
  configPath: z.string().optional()
})
export type JestMode = 'ci' | 'local'
export type JestOptions = z.infer<typeof JestSchema>

export const Schema = JestSchema
