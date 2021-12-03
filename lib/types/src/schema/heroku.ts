import { SchemaOutput } from '../schema'

export const HerokuSchema = {
  pipeline: 'string',
  systemCode: 'string'
} as const
export type HerokuOptions = SchemaOutput<typeof HerokuSchema>

export const Schema = HerokuSchema
