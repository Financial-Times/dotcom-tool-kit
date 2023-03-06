import { z } from 'zod'

export const CypressSchema = z.object({
  localUrl: z.string().optional()
})
export type CypressOptions = z.infer<typeof CypressSchema>

export const Schema = CypressSchema
