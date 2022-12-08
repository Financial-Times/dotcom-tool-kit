import { SchemaOutput } from '../schema'

export const CircleCISchema = {
  nodeVersion: 'string?',
  cypressImage: 'string?'
} as const
export type CircleCIOptions = SchemaOutput<typeof CircleCISchema>

export const Schema = CircleCISchema
