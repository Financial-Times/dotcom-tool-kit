import { z } from 'zod'

export const LintStagedNpmSchema = z.object({
  testGlob: z.string().default('**/*.js'),
  formatGlob: z.string().default('**/*.js')
})
export type LintStagedNpmOptions = z.infer<typeof LintStagedNpmSchema>

export const Schema = LintStagedNpmSchema
