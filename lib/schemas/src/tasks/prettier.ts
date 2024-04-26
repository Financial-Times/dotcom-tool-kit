import { z } from 'zod'

export const PrettierSchema = z
  .object({
    files: z
      .string()
      .array()
      .or(z.string())
      .default(['**/*.{js,jsx,ts,tsx}'])
      .describe('glob pattern of files to run Prettier on.'),
    configFile: z
      .string()
      .optional()
      .describe(
        "path to a Prettier config file to use. Uses Prettier's built-in [config resolution](https://prettier.io/docs/en/configuration.html) by default."
      ),
    ignoreFile: z
      .string()
      .default('.prettierignore')
      .describe('path to a Prettier [ignore file](https://prettier.io/docs/en/ignore).')
  })
  .describe('Format files with `prettier`.')

export type PrettierOptions = z.infer<typeof PrettierSchema>

export const Schema = PrettierSchema
