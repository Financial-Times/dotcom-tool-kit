import { z } from 'zod'

export const BabelSchema = z.object({
  files: z.string().optional(),
  outputPath: z.string().optional(),
  configFile: z.string().optional()
})
export type BabelOptions = z.infer<typeof BabelSchema>

export const Schema = BabelSchema
