import { SchemaOutput } from '../schema'

export const BabelSchema = {
  files: 'string?',
  outputPath: 'string?',
  configFile: 'string?'
} as const
export type BabelOptions = SchemaOutput<typeof BabelSchema>

export const Schema = BabelSchema
