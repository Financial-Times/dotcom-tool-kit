import { z } from 'zod'

export const NextRouterSchema = z.object({
  appName: z.string()
})
export type NextRouterOptions = z.infer<typeof NextRouterSchema>

export const Schema = NextRouterSchema
