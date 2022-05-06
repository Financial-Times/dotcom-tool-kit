import { SchemaOutput } from '../schema'

export const WebpackSchema = {
  configPath: 'string?'
} as const
export type WebpackOptions = SchemaOutput<typeof WebpackSchema>

export const Schema = WebpackSchema
