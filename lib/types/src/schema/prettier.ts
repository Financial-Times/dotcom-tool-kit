import { SchemaOutput } from '../schema'

export const PrettierSchema = {
  files: 'array.string',
  configFile: 'string?',
  ignoreFile: 'string?',
  configOptions: 'record.unknown?'
} as const
export type PrettierOptions = SchemaOutput<typeof PrettierSchema>

export const Schema = PrettierSchema
