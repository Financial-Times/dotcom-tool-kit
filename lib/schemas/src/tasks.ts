import { type InferSchemaOptions } from './infer'
import { BabelSchema } from './tasks/babel'
import { ESLintSchema } from './tasks/eslint'
import { JestSchema } from './tasks/jest'
import { MochaSchema } from './tasks/mocha'
import { NodeSchema } from './tasks/node'
import { NodemonSchema } from './tasks/nodemon'
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
  Commitlint: z.object({}).describe('Lint commit messages.'),
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
