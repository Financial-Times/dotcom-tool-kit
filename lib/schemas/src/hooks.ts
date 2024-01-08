import { PackageJsonSchema } from './hooks/package-json'
import { type InferSchemaOptions } from './infer'

export const HookSchemas = {
  PackageJson: PackageJsonSchema
}

export type HookOptions = InferSchemaOptions<typeof HookSchemas>
