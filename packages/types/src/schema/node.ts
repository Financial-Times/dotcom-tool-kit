import { SchemaOutput } from '../schema'

export const NodeSchema = {
  entry: 'string?',
  config: 'record.unknown?'
} as const
export type NodeOptions = SchemaOutput<typeof NodeSchema>

export const Schema = NodeSchema
