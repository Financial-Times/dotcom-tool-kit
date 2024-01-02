import { z } from 'zod'

export const LintStagedNpmSchema = z.object({
  testGlob: z.string().optional(),
  formatGlob: z.string().optional()
})
export type LintStagedNpmOptions = z.infer<typeof LintStagedNpmSchema>

export const Schema = LintStagedNpmSchema
