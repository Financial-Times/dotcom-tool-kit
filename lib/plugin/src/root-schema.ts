import * as z from 'zod'

export const RootSchema = z.object({
  allowNativeFetch: z.boolean().default(false),
  enableTelemetry: z
    .boolean()
    .default(false)
    .describe(
      'Opt-in to send telemetry on your Tool Kit usage so we can track user patterns and friction points. This will be opt-out in a future version once the telemetry API has stabilised.'
    ),
  // TODO:IM:20251112 require this option in a future major version
  systemCode: z
    .string()
    .optional()
    .describe('Biz Ops system code or the package name prefixed with "npm:" otherwise')
})
export type RootOptions = z.infer<typeof RootSchema>
