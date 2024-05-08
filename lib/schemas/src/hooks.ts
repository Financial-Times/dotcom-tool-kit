import { CircleCiSchema } from './hooks/circleci.js'
import { PackageJsonSchema } from './hooks/package-json.js'
import { type InferSchemaOptions } from './infer.js'

export const HookSchemas = {
  PackageJson: PackageJsonSchema,
  CircleCi: CircleCiSchema
}

export type HookOptions = InferSchemaOptions<typeof HookSchemas>
