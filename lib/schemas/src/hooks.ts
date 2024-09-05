import { CircleCiSchema } from './hooks/circleci'
import { PackageJsonSchema } from './hooks/package-json'
import { type InferSchemaOptions } from './infer'

export const HookSchemas = {
  PackageJson: PackageJsonSchema,
  CircleCi: CircleCiSchema
}

export type HookOptions = InferSchemaOptions<typeof HookSchemas>
