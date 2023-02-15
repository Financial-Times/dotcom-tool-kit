import { z } from 'zod'

export const ESLintSchema = z.object({
  files: z.string().array().default(['**/*.js']),
  config: z.record(z.unknown()).optional(), // @deprecated: use options instead
  options: z.record(z.unknown()).optional()
})
export type ESLintOptions = z.infer<typeof ESLintSchema>

export const Schema = ESLintSchema
