import { z } from 'zod'

export const ESLintSchema = z.object({
  configPath: z.string().optional(),
  files: z.string().array().or(z.string()).default(['**/*.js'])
})

export type ESLintOptions = z.infer<typeof ESLintSchema>

export const Schema = ESLintSchema
