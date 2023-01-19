import { z } from 'zod'

export const PrettierSchema = z.object({
  files: z.string().array(),
  configFile: z.string().optional(),
  ignoreFile: z.string().optional(),
  configOptions: z.record(z.unknown())
})
export type PrettierOptions = z.infer<typeof PrettierSchema>

export const Schema = PrettierSchema
