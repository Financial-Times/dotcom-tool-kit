import { type InferSchemaOptions } from './infer'
import { BabelSchema } from './tasks/babel'

export const TaskSchemas = {
  Babel: BabelSchema
}

export type TaskOptions = InferSchemaOptions<typeof TaskSchemas>
