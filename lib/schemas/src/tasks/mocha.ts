import { z } from 'zod'

export const MochaSchema = z
  .object({
    files: z.string().default('test/**/*.js').describe('A file path glob to Mocha tests.'),
    configPath: z
      .string()
      .optional()
      .describe(
        "Path to the [Mocha config file](https://mochajs.org/#configuring-mocha-nodejs). Uses Mocha's own [config resolution](https://mochajs.org/#priorities) by default."
      )
  })
  .describe('Runs `mocha` to execute tests.')

export type MochaOptions = z.infer<typeof MochaSchema>

export const Schema = MochaSchema
