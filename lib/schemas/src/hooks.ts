import { type z } from 'zod'

import { CircleCiSchema } from './hooks/circleci'
import { PackageJsonSchema } from './hooks/package-json'

export const HookSchemas = {
  PackageJson: PackageJsonSchema,
  CircleCiConfig: CircleCiSchema
}

// Gives the TypeScript type represented by each Schema
export type Options = {
  [plugin in keyof typeof HookSchemas]: (typeof HookSchemas)[plugin] extends z.ZodTypeAny
    ? z.infer<(typeof HookSchemas)[plugin]>
    : never
}
