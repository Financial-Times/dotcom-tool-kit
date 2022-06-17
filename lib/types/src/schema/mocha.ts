import { SchemaOutput } from '../schema'

export const MochaSchema = {
  files: 'string',
  configPath: 'string?'
} as const
export type MochaOptions = SchemaOutput<typeof MochaSchema>

export const Schema = MochaSchema
