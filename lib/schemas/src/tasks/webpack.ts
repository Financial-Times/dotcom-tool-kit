import { z } from 'zod'

export const WebpackSchema = z
  .object({
    configPath: z
      .string()
      .optional()
      .describe('path to a Webpack config file. Webpack will default to `webpack.config.js`.'),
    envName: z
      .union([z.literal('production'), z.literal('development')])
      .describe("set Webpack's [mode](https://webpack.js.org/configuration/mode/)."),
    watch: z.boolean().optional().describe('run Webpack in watch mode')
  })
  .describe('Bundle code with `webpack`.')

export type WebpackOptions = z.infer<typeof WebpackSchema>

export const Schema = WebpackSchema
