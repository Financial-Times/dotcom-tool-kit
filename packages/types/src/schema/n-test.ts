import { SchemaOutput } from '../schema'

export const SmokeTestSchema = {
  browsers: 'array.string?',
  host: 'string?',
  config: 'string?',
  interactive: 'boolean?',
  header: 'record.string?'
} as const
export type SmokeTestOptions = SchemaOutput<typeof SmokeTestSchema>

export const Schema = SmokeTestSchema
