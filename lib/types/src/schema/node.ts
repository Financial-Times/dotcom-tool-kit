import { SchemaOutput } from '../schema'

export const NodeSchema = {
  entry: 'string?',
  args: 'array.string?',
  useVault: 'boolean?'
} as const
export type NodeOptions = SchemaOutput<typeof NodeSchema>

export const Schema = NodeSchema
