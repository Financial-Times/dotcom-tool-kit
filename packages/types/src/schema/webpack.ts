import { SchemaOutput } from '../schema'

export const WebpackSchema = {
  mode: '|production,development',
  configPath: 'string?'
} as const
export type WebpackOptions = SchemaOutput<typeof WebpackSchema>

export const Schema = WebpackSchema
