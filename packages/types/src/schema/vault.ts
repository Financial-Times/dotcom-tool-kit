import { SchemaOutput } from '../schema'

export const VaultSchema = {
  team: 'string',
  app: 'string'
} as const
export type VaultOptions = SchemaOutput<typeof VaultSchema>

export const Schema = VaultSchema
