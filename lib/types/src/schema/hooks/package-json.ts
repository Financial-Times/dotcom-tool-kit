import { z } from 'zod'

export const PackageJsonSchema = z.record(z.record(z.union([z.array(z.string()), z.string()])))

export type PackageJsonOptions = z.infer<typeof PackageJsonSchema>

export const Schema = PackageJsonSchema
