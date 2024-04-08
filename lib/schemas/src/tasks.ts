import { type InferSchemaOptions } from './infer'
import { BabelSchema } from './tasks/babel'
import { ESLintSchema } from './tasks/eslint'
import { JestSchema } from './tasks/jest'
import { MochaSchema } from './tasks/mocha'

export const TaskSchemas = {
  Babel: BabelSchema,
  Eslint: ESLintSchema,
  Jest: JestSchema,
  Mocha: MochaSchema
}

export type TaskOptions = InferSchemaOptions<typeof TaskSchemas>
