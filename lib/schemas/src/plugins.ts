import { CircleCISchema } from './plugins/circleci'
import { CypressSchema } from './plugins/cypress'
import { DopplerSchema } from './plugins/doppler'
import { RootSchema } from './plugins/dotcom-tool-kit'
import { HerokuSchema } from './plugins/heroku'
import { LintStagedNpmSchema } from './plugins/lint-staged-npm'
import { SmokeTestSchema } from './plugins/n-test'
import { NextRouterSchema } from './plugins/next-router'
import { ServerlessSchema } from './plugins/serverless'
import { TypeScriptSchema } from './plugins/typescript'
import { UploadAssetsToS3Schema } from './plugins/upload-assets-to-s3'
import { VaultSchema } from './plugins/vault'
import { WebpackSchema } from './plugins/webpack'
import { type InferSchemaOptions } from './infer'

export const PluginSchemas = {
  'app root': RootSchema,
  '@dotcom-tool-kit/circleci': CircleCISchema,
  '@dotcom-tool-kit/cypress': CypressSchema,
  '@dotcom-tool-kit/doppler': DopplerSchema,
  '@dotcom-tool-kit/heroku': HerokuSchema,
  '@dotcom-tool-kit/lint-staged-npm': LintStagedNpmSchema,
  '@dotcom-tool-kit/n-test': SmokeTestSchema,
  '@dotcom-tool-kit/next-router': NextRouterSchema,
  '@dotcom-tool-kit/serverless': ServerlessSchema,
  '@dotcom-tool-kit/typescript': TypeScriptSchema,
  '@dotcom-tool-kit/upload-assets-to-s3': UploadAssetsToS3Schema,
  '@dotcom-tool-kit/vault': VaultSchema,
  '@dotcom-tool-kit/webpack': WebpackSchema
}

export type PluginOptions = InferSchemaOptions<typeof PluginSchemas>
