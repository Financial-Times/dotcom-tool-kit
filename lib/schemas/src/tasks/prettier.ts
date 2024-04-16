import { z } from 'zod'

export const PrettierSchema = z.object({
  files: z.string().array().or(z.string()).default(['**/*.{js,jsx,ts,tsx}']),
  configFile: z.string().optional(),
  ignoreFile: z.string().default('.prettierignore')
})

export type PrettierOptions = z.infer<typeof PrettierSchema>

export const Schema = PrettierSchema
