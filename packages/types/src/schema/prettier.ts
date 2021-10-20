import { SchemaOutput } from '../schema'

export const PrettierSchema = {
  files: 'array.string',
  configFile: 'string?',
  configOptions: 'record.unknown?',
  lintStagedGlob: 'string?'
} as const
export type PrettierOptions = SchemaOutput<typeof PrettierSchema>

export const Schema = PrettierSchema
