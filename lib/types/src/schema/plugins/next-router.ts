import { z } from 'zod'

export const NextRouterSchema = z.object({
  appName: z
    .string()
    .describe(
      'This needs to be same as the name your app is registered under in next-service-registry. This is usually – but not always – your system code.'
    )
})
export type NextRouterOptions = z.infer<typeof NextRouterSchema>

export const Schema = NextRouterSchema
