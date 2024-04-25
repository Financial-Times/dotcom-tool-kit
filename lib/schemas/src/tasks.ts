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
import { UploadAssetsToS3Schema } from './tasks/upload-assets-to-s3'
import { WebpackSchema } from './tasks/webpack'
import { SmokeTestSchema } from './tasks/n-test'
import { CypressSchema } from './tasks/cypress'
import { HerokuProductionSchema } from './tasks/heroku-production'
import { ServerlessRunSchema } from './tasks/serverless-run'
import { z } from 'zod'

export const TaskSchemas = {
  Babel: BabelSchema,
  Cypress: CypressSchema,
  Eslint: ESLintSchema,
  HerokuProduction: HerokuProductionSchema,
  Jest: JestSchema,
  Mocha: MochaSchema,
  Node: NodeSchema,
  Nodemon: NodemonSchema,
  NpmPrune: z.object({}).describe('Prune development npm dependencies.'),
  NpmPublish: z.object({}).describe('Publish package to the npm registry.'),
  NTest: SmokeTestSchema,
  Pa11y: Pa11ySchema,
  Prettier: PrettierSchema,
  ServerlessRun: ServerlessRunSchema,
  TypeScript: TypeScriptSchema,
  UploadAssetsToS3: UploadAssetsToS3Schema,
  Webpack: WebpackSchema
}

export type TaskOptions = InferSchemaOptions<typeof TaskSchemas>
