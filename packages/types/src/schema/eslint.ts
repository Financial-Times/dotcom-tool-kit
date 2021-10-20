import { SchemaOutput } from '../schema'

export const ESLintSchema = {
  files: 'array.string',
  config: 'record.unknown?'
} as const
export type ESLintOptions = SchemaOutput<typeof ESLintSchema>

export const Schema = ESLintSchema
