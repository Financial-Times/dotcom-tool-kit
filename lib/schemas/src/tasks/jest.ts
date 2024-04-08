import { z } from 'zod'

export const JestSchema = z.object({
  configPath: z.string().optional(),
  mode: z.union([z.literal('ci'), z.literal('local')])
})

export type JestOptions = z.infer<typeof JestSchema>

export const Schema = JestSchema
