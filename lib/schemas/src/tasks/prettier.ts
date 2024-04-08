import { z } from 'zod'

export const PrettierSchema = z.object({
  files: z.string().array().or(z.string()).default(['**/*.{js,jsx,ts,tsx}']),
  configFile: z.string().optional(),
  ignoreFile: z.string().default('.prettierignore'),
  configOptions: z.record(z.unknown()).default({
    singleQuote: true,
    useTabs: true,
    bracketSpacing: true,
    arrowParens: 'always',
    trailingComma: 'none'
  })
})

export type PrettierOptions = z.infer<typeof PrettierSchema>

export const Schema = PrettierSchema
