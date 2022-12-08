import { SchemaOutput } from '../schema'

export const CypressSchema = {
  localUrl: 'string?'
} as const
export type CypressOptions = SchemaOutput<typeof CypressSchema>

export const Schema = CypressSchema
