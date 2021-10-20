import { SchemaOutput } from '../schema'

export const LintStagedNpmSchema = {
  testGlob: 'string?',
  formatGlob: 'string?'
} as const
export type LintStagedNpmOptions = SchemaOutput<typeof LintStagedNpmSchema>

export const Schema = LintStagedNpmSchema
