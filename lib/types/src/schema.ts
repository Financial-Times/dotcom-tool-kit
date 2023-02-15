import type prompts from 'prompts'
import type { Logger } from 'winston'
import { z } from 'zod'

export type SchemaPromptGenerator<T> = (
  logger: Logger,
  prompt: typeof prompts,
  onCancel: () => void
) => Promise<T>
export type PromptGenerators<T> = T extends z.ZodObject<infer Shape>
  ? {
      [option in keyof Shape as Shape[option] extends z.ZodType
        ? option
        : never]?: Shape[option] extends z.ZodType ? SchemaPromptGenerator<z.output<Shape[option]>> : never
    }
  : never

import { ESLintSchema } from './schema/eslint'
import { HerokuSchema } from './schema/heroku'
import { MochaSchema } from './schema/mocha'
import { SmokeTestSchema } from './schema/n-test'
import { UploadAssetsToS3Schema } from './schema/upload-assets-to-s3'
import { VaultSchema } from './schema/vault'
import { WebpackSchema } from './schema/webpack'
import { NodeSchema } from './schema/node'
import { NodemonSchema } from './schema/nodemon'
import { NextRouterSchema } from './schema/next-router'
import { PrettierSchema } from './schema/prettier'
import { LintStagedNpmSchema } from './schema/lint-staged-npm'
import { BabelSchema } from './schema/babel'
import { CircleCISchema } from './schema/circleci'
import { CypressSchema } from './schema/cypress'
import { TypeScriptSchema } from './schema/typescript'

export const Schemas = {
  '@dotcom-tool-kit/eslint': ESLintSchema,
  '@dotcom-tool-kit/heroku': HerokuSchema,
  '@dotcom-tool-kit/mocha': MochaSchema,
  '@dotcom-tool-kit/n-test': SmokeTestSchema,
  '@dotcom-tool-kit/upload-assets-to-s3': UploadAssetsToS3Schema,
  '@dotcom-tool-kit/vault': VaultSchema,
  '@dotcom-tool-kit/webpack': WebpackSchema,
  '@dotcom-tool-kit/node': NodeSchema,
  '@dotcom-tool-kit/nodemon': NodemonSchema,
  '@dotcom-tool-kit/next-router': NextRouterSchema,
  '@dotcom-tool-kit/prettier': PrettierSchema,
  '@dotcom-tool-kit/lint-staged-npm': LintStagedNpmSchema,
  '@dotcom-tool-kit/babel': BabelSchema,
  '@dotcom-tool-kit/circleci': CircleCISchema,
  '@dotcom-tool-kit/cypress': CypressSchema,
  '@dotcom-tool-kit/typescript': TypeScriptSchema
}

export type Options = {
  [plugin in keyof typeof Schemas]?: typeof Schemas[plugin] extends z.ZodTypeAny
    ? z.infer<typeof Schemas[plugin]>
    : never
}
