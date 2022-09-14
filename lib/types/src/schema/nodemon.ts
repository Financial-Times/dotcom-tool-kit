import { SchemaOutput } from '../schema'

export const NodemonSchema = {
  entry: 'string?',
  configPath: 'string?',
  useVault: 'boolean?',
  ports: 'array.number?'
} as const
export type NodemonOptions = SchemaOutput<typeof NodemonSchema>

export const Schema = NodemonSchema
