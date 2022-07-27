import { SchemaOutput } from '../schema'

export const Pa11ySchema = {
  configFile: 'string?'
} as const
export type Pa11yOptions = SchemaOutput<typeof Pa11ySchema>

export const Schema = Pa11ySchema
