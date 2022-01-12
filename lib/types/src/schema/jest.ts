import { SchemaOutput } from '../schema'

export const JestSchema = {
  configPath: 'string?'
} as const
export type JestOptions = SchemaOutput<typeof JestSchema>

export const Schema = JestSchema
