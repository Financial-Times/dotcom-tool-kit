import * as z from 'zod'

export const RootSchema = z.object({
  allowNativeFetch: z.boolean().default(false),
  // TODO:IM:20251112 require this option in a future major version
  systemCode: z
    .string()
    .optional()
    .describe('Biz Ops system code or the package name prefixed with "npm:" otherwise')
})
export type RootOptions = z.infer<typeof RootSchema>
