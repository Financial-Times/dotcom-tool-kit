import { z } from 'zod'

export const NextRouterSchema = z.object({
  appName: z
    .string()
    .describe(
      "The system's `name` field as it appears in [next-service-registry](https://next-registry.ft.com/v2). **This is often different to its Biz Ops system code**, so be sure to check."
    )
})

export type NextRouterOptions = z.infer<typeof NextRouterSchema>

export const Schema = NextRouterSchema
