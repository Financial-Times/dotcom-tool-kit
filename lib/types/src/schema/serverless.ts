import { SchemaOutput } from '../schema'

export const ServerlessSchema = {
  configPath: 'string?',
  useVault: 'boolean?',
  ports: 'array.number?'
} as const
export type ServerlessOptions = SchemaOutput<typeof ServerlessSchema>

export const Schema = ServerlessSchema
