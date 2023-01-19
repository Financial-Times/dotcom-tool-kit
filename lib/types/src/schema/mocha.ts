import { z } from 'zod'

export const MochaSchema = z.object({
  files: z.string(),
  configPath: z.string().optional()
})
export type MochaOptions = z.infer<typeof MochaSchema>

export const Schema = MochaSchema
