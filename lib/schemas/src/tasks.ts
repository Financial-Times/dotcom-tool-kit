import { type InferSchemaOptions } from './infer.js'
import { BabelSchema } from './tasks/babel.js'
import { ESLintSchema } from './tasks/eslint.js'
import { JestSchema } from './tasks/jest.js'
import { MochaSchema } from './tasks/mocha.js'
import { NodeSchema } from './tasks/node.js'
import { NodemonSchema } from './tasks/nodemon.js'
import { Pa11ySchema } from './tasks/pa11y.js'
import { PrettierSchema } from './tasks/prettier.js'
import { TypeScriptSchema } from './tasks/typescript.js'
import { UploadAssetsToS3Schema } from './tasks/upload-assets-to-s3.js'
import { WebpackSchema } from './tasks/webpack.js'
import { SmokeTestSchema } from './tasks/n-test.js'
import { CypressSchema } from './tasks/cypress.js'
import { HerokuProductionSchema } from './tasks/heroku-production.js'
import { ServerlessRunSchema } from './tasks/serverless-run.js'
import { z } from 'zod'

export const TaskSchemas = {
  Babel: BabelSchema,
  Cypress: CypressSchema,
  Eslint: ESLintSchema,
  HerokuProduction: HerokuProductionSchema,
  HerokuReview: z.object({}).describe('Create and deploy a Heroku review app.'),
  HerokuStaging: z.object({}).describe('Deploy to the Heroku staging app.'),
  HerokuTeardown: z.object({}).describe("Scale down the Heroku staging app once it's no longer needed."),
  Jest: JestSchema,
  LintStaged: z.object({}).describe('Run `lint-staged` in your repo, for use with git hooks.'),
  Mocha: MochaSchema,
  Node: NodeSchema,
  Nodemon: NodemonSchema,
  NpmPrune: z.object({}).describe('Prune development npm dependencies.'),
  NpmPublish: z.object({}).describe('Publish package to the npm registry.'),
  NTest: SmokeTestSchema,
  Pa11y: Pa11ySchema,
  Prettier: PrettierSchema,
  ServerlessDeploy: z.object({}).describe('Deploy a serverless function'),
  ServerlessProvision: z.object({}).describe('Provision a review serverless function'),
  ServerlessRun: ServerlessRunSchema,
  ServerlessTeardown: z.object({}).describe('Tear down existing serverless functions'),
  TypeScript: TypeScriptSchema,
  UploadAssetsToS3: UploadAssetsToS3Schema,
  Webpack: WebpackSchema
}

export type TaskOptions = InferSchemaOptions<typeof TaskSchemas>
