import * as z from 'zod'

export const RootSchema = z.object({
  allowNativeFetch: z.boolean().default(false)
})
export type RootOptions = z.infer<typeof RootSchema>
