import { z } from 'zod'

export const BabelSchema = z
  .object({
    files: z.string().default('src/**/*.js').describe('a glob pattern of files to build in your repo'),
    outputPath: z.string().default('lib').describe('folder to output built files into'),
    configFile: z
      .string()
      .optional()
      .describe('path to the Babel [config file](https://babeljs.io/docs/configuration) to use'),
    envName: z
      .union([z.literal('production'), z.literal('development')])
      .describe('the Babel [environment](https://babeljs.io/docs/options#env) to use')
  })
  .describe('Compile files with Babel')

export type BabelOptions = z.infer<typeof BabelSchema>

export const Schema = BabelSchema
