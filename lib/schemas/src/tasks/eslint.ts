import { z } from 'zod'

export const ESLintSchema = z
  .object({
    configPath: z
      .string()
      .optional()
      .describe(
        'Path to the [ESLint config file](https://eslint.org/docs/v8.x/use/configure/configuration-files) to use.'
      ),
    files: z
      .string()
      .array()
      .or(z.string())
      .default(['**/*.js'])
      .describe(
        'The glob patterns for lint target files. This can either be a string or an array of strings.'
      )
  })
  .describe('Runs `eslint` to lint and format target files.')

export type ESLintOptions = z.infer<typeof ESLintSchema>

export const Schema = ESLintSchema
