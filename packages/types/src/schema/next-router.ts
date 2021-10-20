import { SchemaOutput } from '../schema'

export const NextRouterSchema = {
  appName: 'string'
} as const
export type NextRouterOptions = SchemaOutput<typeof NextRouterSchema>

export const Schema = NextRouterSchema
