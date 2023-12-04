import { z } from 'zod'

export const LighthouseSchema = z.object({
  url: z.string()
})
export type LighthouseOptions = z.infer<typeof LighthouseSchema>

export const Schema = LighthouseSchema
