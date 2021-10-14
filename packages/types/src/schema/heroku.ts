import { SchemaOutput } from '../schema'

export const HerokuSchema = {
  pipeline: 'string?',
  vaultTeam: 'string?',
  vaultApp: 'string?',
  systemCode: 'string?'
} as const
export type HerokuOptions = SchemaOutput<typeof HerokuSchema>

export const Schema = HerokuSchema
