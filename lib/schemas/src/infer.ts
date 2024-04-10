import { type z } from 'zod'

// Gives the TypeScript type represented by each Schema
export type InferSchemaOptions<Schemas> = {
  [key in keyof Schemas]: Schemas[key] extends z.ZodTypeAny ? z.infer<Schemas[key]> : never
}
