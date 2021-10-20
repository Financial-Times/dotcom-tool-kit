import { SchemaOutput } from '../schema'

export const NodeSchema = {
  entry: 'string?'
} as const
export type NodeOptions = SchemaOutput<typeof NodeSchema>

export const Schema = NodeSchema
