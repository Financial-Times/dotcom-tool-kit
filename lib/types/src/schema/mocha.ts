import { SchemaOutput } from '../schema'

export const MochaSchema = {
  files: 'string'
} as const
export type MochaOptions = SchemaOutput<typeof MochaSchema>

export const Schema = MochaSchema
