import { SchemaOutput } from '../schema'

export const HerokuSchema = {
  pipeline: 'string',
  systemCode: 'string'
} as const
// HACK: improve SchemaOutput type to support nested objects
export type HerokuOptions = SchemaOutput<typeof HerokuSchema> & {
  scaling: { [app: string]: { [appType: string]: { size: string; quantity: number } } }
}

export const Schema = HerokuSchema
