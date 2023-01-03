import { SchemaOutput } from '../schema'

export const TypeScriptSchema = {
  configPath: 'string?',
  extraArgs: 'array.string?'
} as const
export type TypeScriptOptions = SchemaOutput<typeof TypeScriptSchema>

export const Schema = TypeScriptSchema
