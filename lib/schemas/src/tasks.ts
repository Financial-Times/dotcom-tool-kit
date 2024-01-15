import { type InferSchemaOptions } from './infer'
import { BabelSchema } from './tasks/babel'
import { ESLintSchema } from './tasks/eslint'

export const TaskSchemas = {
  Babel: BabelSchema,
  Eslint: ESLintSchema
}

export type TaskOptions = InferSchemaOptions<typeof TaskSchemas>
