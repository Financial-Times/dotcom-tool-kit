import { z } from 'zod'

export const Pa11ySchema = z.object({
  configFile: z.string().optional()
})

export type Pa11yOptions = z.infer<typeof Pa11ySchema>

export const Schema = Pa11ySchema
