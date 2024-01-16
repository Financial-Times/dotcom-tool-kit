import { z } from 'zod'

export const BabelSchema = z.object({
  files: z.string().optional(),
  outputPath: z.string().optional(),
  configFile: z.string().optional(),
  envName: z.union([z.literal('production'), z.literal('development')])
})

export type BabelOptions = z.infer<typeof BabelSchema>

export const Schema = BabelSchema
