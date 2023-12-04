import { z } from 'zod'

export const Lighthouse = z.object({
  url: z.string()
})
export type LighthouseOptions = z.infer<typeof Lighthouse>

export const Schema = Lighthouse
