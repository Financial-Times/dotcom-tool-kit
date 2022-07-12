import { SchemaOutput } from '../schema'

export const Pa11ySchema = {
  host: 'string?',
  wait: 'number?',
  tests: 'array.string?',
  exceptions: 'array.string?',
  hideElements: 'string?',
  viewports: 'array.string?',
  screenCapturePath: 'string?'
} as const
export type Pa11yOptions = SchemaOutput<typeof Pa11ySchema>

export const Schema = Pa11ySchema
