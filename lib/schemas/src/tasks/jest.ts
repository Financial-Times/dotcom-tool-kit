import { z } from 'zod'

export const JestSchema = z
  .object({
    configPath: z
      .string()
      .optional()
      .describe(
        "Path to the [Jest config file](https://jestjs.io/docs/27.x/configuration). Use Jest's own [config resolution](https://jestjs.io/docs/configuration/) by default."
      ),
    ci: z
      .literal(true)
      .optional()
      .describe('Whether to run Jest in [CI mode](https://jestjs.io/docs/cli#--ci).')
  })
  .describe('Runs `jest` to execute tests.')

export type JestOptions = z.infer<typeof JestSchema>

export const Schema = JestSchema
