import type prompts from 'prompts'
import type { Logger } from 'winston'

export type ScalarSchemaType = 'string' | 'number' | 'boolean' | `|${string},${string}` | 'unknown'
export type SchemaType = ScalarSchemaType | `array.${ScalarSchemaType}` | `record.${ScalarSchemaType}`
export type SchemaPromptGenerator<T> = (
  logger: Logger,
  prompt: typeof prompts,
  onCancel: () => void
) => Promise<T>
export type ModifiedSchemaType = SchemaType | `${SchemaType}?` | SchemaPromptGenerator<unknown>

export type Schema = {
  readonly [option: string]: ModifiedSchemaType
}

// Achieve the mapping with conditional types
type SchemaTypeOutput<T extends SchemaType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends `|${infer A},${infer B}`
  ? A | B
  : T extends 'unknown'
  ? unknown
  : T extends `array.${infer S}`
  ? S extends SchemaType
    ? Array<SchemaTypeOutput<S>>
    : never
  : T extends `record.${infer S}`
  ? S extends SchemaType
    ? Record<string, SchemaTypeOutput<S>>
    : never
  : never

export type SchemaOutput<T extends Schema> = {
  -readonly [option in keyof T as T[option] extends SchemaType
    ? option
    : never]-?: T[option] extends SchemaType ? SchemaTypeOutput<T[option]> : never
} &
  {
    -readonly [option in keyof T as T[option] extends `${string}?`
      ? option
      : never]?: T[option] extends `${infer S}?`
      ? S extends SchemaType
        ? SchemaTypeOutput<S>
        : never
      : never
  } &
  {
    -readonly [option in keyof T as T[option] extends SchemaPromptGenerator<unknown>
      ? option
      : never]: T[option] extends SchemaPromptGenerator<infer R> ? R : never
  }

import type { ESLintOptions } from './schema/eslint'
import type { HerokuOptions } from './schema/heroku'
import type { MochaOptions } from './schema/mocha'
import type { SmokeTestOptions } from './schema/n-test'
import type { UploadAssetsToS3Options } from './schema/upload-assets-to-s3'
import type { VaultOptions } from './schema/vault'
import type { WebpackOptions } from './schema/webpack'
import type { NodeOptions } from './schema/node'
import type { NodemonOptions } from './schema/nodemon'
import type { NextRouterOptions } from './schema/next-router'
import type { PrettierOptions } from './schema/prettier'
import type { LintStagedNpmOptions } from './schema/lint-staged-npm'
import type { BabelOptions } from './schema/babel'
import type { CircleCIOptions } from './schema/circleci'
import type { CypressOptions } from './schema/cypress'
import type { TypeScriptOptions } from './schema/typescript'

export type Options = {
  '@dotcom-tool-kit/eslint'?: ESLintOptions
  '@dotcom-tool-kit/heroku'?: HerokuOptions
  '@dotcom-tool-kit/mocha'?: MochaOptions
  '@dotcom-tool-kit/n-test'?: SmokeTestOptions
  '@dotcom-tool-kit/upload-assets-to-s3'?: UploadAssetsToS3Options
  '@dotcom-tool-kit/vault'?: VaultOptions
  '@dotcom-tool-kit/webpack'?: WebpackOptions
  '@dotcom-tool-kit/node'?: NodeOptions
  '@dotcom-tool-kit/nodemon'?: NodemonOptions
  '@dotcom-tool-kit/next-router'?: NextRouterOptions
  '@dotcom-tool-kit/prettier'?: PrettierOptions
  '@dotcom-tool-kit/lint-staged-npm'?: LintStagedNpmOptions
  '@dotcom-tool-kit/babel'?: BabelOptions
  '@dotcom-tool-kit/circleci'?: CircleCIOptions
  '@dotcom-tool-kit/cypress'?: CypressOptions
  '@dotcom-tool-kit/typescript'?: TypeScriptOptions
}
