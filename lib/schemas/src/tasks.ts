import { type InferSchemaOptions } from './infer'
import { BabelSchema } from './tasks/babel'
import { ESLintSchema } from './tasks/eslint'
import { JestSchema } from './tasks/jest'
import { MochaSchema } from './tasks/mocha'
import { NodeSchema } from './tasks/node'
import { NodemonSchema } from './tasks/nodemon'
import { Pa11ySchema } from './tasks/pa11y'
import { PrettierSchema } from './tasks/prettier'
import { TypeScriptSchema } from './tasks/typescript'

export const TaskSchemas = {
  Babel: BabelSchema,
  Eslint: ESLintSchema,
  Jest: JestSchema,
  Mocha: MochaSchema,
  Node: NodeSchema,
  Nodemon: NodemonSchema,
  Pa11y: Pa11ySchema,
  Prettier: PrettierSchema,
  TypeScript: TypeScriptSchema
}

export type TaskOptions = InferSchemaOptions<typeof TaskSchemas>
