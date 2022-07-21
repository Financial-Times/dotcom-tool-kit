import { styles as s } from '@dotcom-tool-kit/logger'
import fs from 'fs'
import path from 'path'
import semver from 'semver'
import type { Logger } from 'winston'
import { Schema, SchemaOutput } from './schema'

const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const version: string = packageJson.version

// uses Symbol.for, not Symbol, so that they're compatible across different
// @dotcom-tool-kit/types instances

// used as the name for the property we use to identify classes
const typeSymbol = Symbol.for('@dotcom-tool-kit/types')

// used to identify the Base, Task and Hook classes
const baseSymbol = Symbol.for('@dotcom-tool-kit/types/base')
const taskSymbol = Symbol.for('@dotcom-tool-kit/types/task')
const hookSymbol = Symbol.for('@dotcom-tool-kit/types/hook')

export interface Invalid {
  valid: false
  reasons: string[]
}
export interface Valid<T> {
  valid: true
  value: T
}
export type Validated<T> = Invalid | Valid<T>

export function mapValidated<T, U>(validated: Validated<T>, f: (val: T) => U): Validated<U> {
  if (validated.valid) {
    return { valid: true, value: f(validated.value) }
  } else {
    return validated
  }
}

export function mapValidationError<T>(
  validated: Validated<T>,
  f: (reasons: string[]) => string[]
): Validated<T> {
  if (validated.valid) {
    return validated
  } else {
    return { valid: false, reasons: f(validated.reasons) }
  }
}

export function joinValidated<T, U>(first: Validated<T>, second: Validated<U>): Validated<[T, U]> {
  if (first.valid) {
    if (second.valid) {
      return { valid: true, value: [first.value, second.value] }
    } else {
      return second
    }
  } else {
    if (second.valid) {
      return first
    } else {
      return { valid: false, reasons: [...first.reasons, ...second.reasons] }
    }
  }
}

export function reduceValidated<T>(validated: Validated<T>[]): Validated<T[]> {
  let sequenced: Validated<T[]> = { valid: true, value: [] }
  for (const val of validated) {
    if (sequenced.valid) {
      if (val.valid) {
        sequenced.value.push(val.value)
      } else {
        sequenced = { valid: false, reasons: val.reasons }
      }
    } else if (!val.valid) {
      sequenced.reasons.push(...val.reasons)
    }
  }
  return sequenced
}

abstract class Base {
  static version = version
  version = version

  static get [typeSymbol](): symbol {
    return baseSymbol
  }

  get [typeSymbol](): symbol {
    return baseSymbol
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static is<T extends Base>(objectToCheck: any): objectToCheck is T {
    return objectToCheck[typeSymbol] === this[typeSymbol]
  }

  static isCompatible<T extends Base>(objectToCheck: unknown): Validated<T> {
    if (!this.is(objectToCheck)) {
      return {
        valid: false,
        reasons: [
          `${s.plugin(
            '@dotcom-tool-kit/types'
          )} type symbol is missing, make sure that this object derives from the ${s.code(
            'Task'
          )} or ${s.code('Hook')} class defined by the plugin`
        ]
      }
    }

    // an 'objectToCheck' from a plugin is compatible with this CLI if its
    // version is semver-compatible with the @dotcom-tool-kit/types included by
    // the CLI (which is what's calling this). so, prepend ^ to our version,
    // and check our version satisfies that.

    // this lets e.g. a CLI that includes types@2.2.0 load any plugin
    // that depends on any higher minor version of types.
    const range = `^${this.version}`
    if (semver.satisfies(objectToCheck.version, range)) {
      return { valid: true, value: objectToCheck as T }
    } else {
      return {
        valid: false,
        reasons: [
          `object is from an outdated version of ${s.plugin(
            '@dotcom-tool-kit/types'
          )}, make sure you're using at least version ${s.heading(this.version)} of the plugin`
        ]
      }
    }
  }
}

export abstract class Task<O extends Schema = Record<string, never>> extends Base {
  static description: string
  static plugin?: Plugin
  static id?: string

  static get [typeSymbol](): symbol {
    return taskSymbol
  }

  get [typeSymbol](): symbol {
    return taskSymbol
  }

  static defaultOptions: Record<string, unknown> = {}
  options: SchemaOutput<O>
  logger: Logger

  constructor(logger: Logger, options: Partial<SchemaOutput<O>> = {}) {
    super()

    const staticThis = this.constructor as typeof Task
    this.options = Object.assign({}, staticThis.defaultOptions as SchemaOutput<O>, options)
    this.logger = logger.child({ task: staticThis.id })
  }

  abstract run(files?: string[]): Promise<void>
}

export type TaskClass = {
  new <O extends Schema>(logger: Logger, options: Partial<SchemaOutput<O>>): Task<O>
} & typeof Task

export abstract class Hook extends Base {
  id?: string
  plugin?: Plugin
  logger: Logger
  static description?: string

  static get [typeSymbol](): symbol {
    return hookSymbol
  }

  get [typeSymbol](): symbol {
    return hookSymbol
  }

  constructor(logger: Logger) {
    super()

    this.logger = logger.child({ hook: this.constructor.name })
  }

  abstract check(): Promise<boolean>
  abstract install(): Promise<void>
}

export type HookClass = { new (logger: Logger): Hook } & typeof Hook

export type RCFile = {
  plugins: string[]
  hooks: { [id: string]: string | string[] }
  options: { [id: string]: Record<string, unknown> }
}

export interface Plugin {
  id: string
  root: string
  rcFile?: RCFile
  module?: PluginModule
  parent?: Plugin
  children?: Plugin[]
}

export interface PluginModule {
  tasks: TaskClass[]
  hooks: {
    [id: string]: HookClass
  }
}
