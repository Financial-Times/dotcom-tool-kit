import { SchemaOutput } from '../schema'

export const NodemonSchema = {
  entry: 'string?'
} as const
export type NodemonOptions = SchemaOutput<typeof NodemonSchema>

export const Schema = NodemonSchema
