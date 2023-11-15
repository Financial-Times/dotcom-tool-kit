import { z } from 'zod'

export const MochaSchema = z.object({
  files: z.string().default('test/**/*.js'),
  configPath: z.string().optional()
})
export type MochaOptions = z.infer<typeof MochaSchema>

export const Schema = MochaSchema
