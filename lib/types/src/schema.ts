import type prompts from 'prompts'
import type { Logger } from 'winston'
import { z } from 'zod'

/**
 * A function that should use the `prompt` parameter passed to build a more
 * complex option structure, like a nested object, from user input
 * @param onCancel - pass this to `prompt`'s options so that a user
 *   interrupting the prompt can be handled properly
 */
export type SchemaPromptGenerator<T> = (
  logger: Logger,
  prompt: typeof prompts,
  onCancel: () => void
) => Promise<T>
// This type defines an interface you can use to export prompt generators. The
// `T` type parameter should be the type of your `Schema` object, and it will
// be mapped into a partial object of `SchemaPromptGenerator` functions with
// all their return types set to the output type of each option schema.
export type PromptGenerators<T> = T extends z.ZodObject<infer Shape>
  ? {
      [option in keyof Shape as Shape[option] extends z.ZodType
        ? option
        : never]?: Shape[option] extends z.ZodType ? SchemaPromptGenerator<z.output<Shape[option]>> : never
    }
  : never

import { BabelSchema } from './schema/babel'
import { CircleCISchema } from './schema/circleci'
import { CypressSchema } from './schema/cypress'
import { DopplerSchema } from './schema/doppler'
import { RootSchema } from './schema/dotcom-tool-kit'
import { ESLintSchema } from './schema/eslint'
import { HerokuSchema } from './schema/heroku'
import { LintStagedNpmSchema } from './schema/lint-staged-npm'
import { JestSchema } from './schema/jest'
import { MochaSchema } from './schema/mocha'
import { SmokeTestSchema } from './schema/n-test'
import { NextRouterSchema } from './schema/next-router'
import { NodeSchema } from './schema/node'
import { NodemonSchema } from './schema/nodemon'
import { Pa11ySchema } from './schema/pa11y'
import { PrettierSchema } from './schema/prettier'
import { ServerlessSchema } from './schema/serverless'
import { TypeScriptSchema } from './schema/typescript'
import { UploadAssetsToS3Schema } from './schema/upload-assets-to-s3'
import { VaultSchema } from './schema/vault'
import { WebpackSchema } from './schema/webpack'

export const Schemas = {
  'app root': RootSchema,
  '@dotcom-tool-kit/babel': BabelSchema,
  '@dotcom-tool-kit/circleci': CircleCISchema,
  '@dotcom-tool-kit/cypress': CypressSchema,
  '@dotcom-tool-kit/doppler': DopplerSchema,
  '@dotcom-tool-kit/eslint': ESLintSchema,
  '@dotcom-tool-kit/heroku': HerokuSchema,
  '@dotcom-tool-kit/lint-staged-npm': LintStagedNpmSchema,
  '@dotcom-tool-kit/jest': JestSchema,
  '@dotcom-tool-kit/mocha': MochaSchema,
  '@dotcom-tool-kit/n-test': SmokeTestSchema,
  '@dotcom-tool-kit/next-router': NextRouterSchema,
  '@dotcom-tool-kit/node': NodeSchema,
  '@dotcom-tool-kit/nodemon': NodemonSchema,
  '@dotcom-tool-kit/pa11y': Pa11ySchema,
  '@dotcom-tool-kit/prettier': PrettierSchema,
  '@dotcom-tool-kit/serverless': ServerlessSchema,
  '@dotcom-tool-kit/typescript': TypeScriptSchema,
  '@dotcom-tool-kit/upload-assets-to-s3': UploadAssetsToS3Schema,
  '@dotcom-tool-kit/vault': VaultSchema,
  '@dotcom-tool-kit/webpack': WebpackSchema
}

// Gives the TypeScript type represented by each Schema
export type Options = {
  [plugin in keyof typeof Schemas]: typeof Schemas[plugin] extends z.ZodTypeAny
    ? z.infer<typeof Schemas[plugin]>
    : never
}
