import { z } from 'zod'

export const WebpackSchema = z.object({
  configPath: z.string().optional()
})
export type WebpackOptions = z.infer<typeof WebpackSchema>

export const Schema = WebpackSchema
