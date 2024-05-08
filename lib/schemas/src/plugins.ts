import { z } from 'zod'

import { CircleCISchema } from './plugins/circleci.js'
import { DopplerSchema } from './plugins/doppler.js'
import { RootSchema } from './plugins/dotcom-tool-kit.js'
import { HerokuSchema } from './plugins/heroku.js'
import { LintStagedNpmSchema } from './plugins/lint-staged-npm.js'
import { NextRouterSchema } from './plugins/next-router.js'
import { ServerlessSchema } from './plugins/serverless.js'
import { VaultSchema } from './plugins/vault.js'
import { type InferSchemaOptions } from './infer.js'

// TODO:KB:20240412 remove legacyPluginOptions in a future major version
export const legacyPluginOptions: Record<string, string> = {
  '@dotcom-tool-kit/babel': 'Babel',
  '@dotcom-tool-kit/cypress': 'Cypress',
  '@dotcom-tool-kit/eslint': 'ESLint',
  '@dotcom-tool-kit/jest': 'Jest',
  '@dotcom-tool-kit/mocha': 'Mocha',
  '@dotcom-tool-kit/n-test': 'NTest',
  '@dotcom-tool-kit/node': 'Node',
  '@dotcom-tool-kit/nodemon': 'Nodemon',
  '@dotcom-tool-kit/pa11y': 'Pa11y',
  '@dotcom-tool-kit/prettier': 'Prettier',
  '@dotcom-tool-kit/typescript': 'TypeScript',
  '@dotcom-tool-kit/upload-assets-to-s3': 'UploadAssetsToS3',
  '@dotcom-tool-kit/webpack': 'Webpack'
}

export const PluginSchemas = {
  'app root': RootSchema,
  '@dotcom-tool-kit/circleci': CircleCISchema,
  '@dotcom-tool-kit/doppler': DopplerSchema,
  '@dotcom-tool-kit/heroku': HerokuSchema,
  '@dotcom-tool-kit/lint-staged-npm': LintStagedNpmSchema,
  '@dotcom-tool-kit/next-router': NextRouterSchema,
  '@dotcom-tool-kit/serverless': ServerlessSchema,
  '@dotcom-tool-kit/vault': VaultSchema
}

export type PluginOptions = InferSchemaOptions<typeof PluginSchemas>
