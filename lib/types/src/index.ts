import type { Logger } from 'winston'
import { Schema, SchemaOutput } from './schema'
import fs from 'fs'
import path from 'path'
import semver from 'semver'

const packageJsonPath = path.resolve(__dirname, '../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const version: string = packageJson.version

// uses Symbol.for, not Symbol, so they're compatible across different
// @dotcom-tool-kit/types instances

// used as the name for the property we use to identify classes
const typeSymbol = Symbol.for('@dotcom-tool-kit/types')

// used to identify the Base, Task and Hook classes
const baseSymbol = Symbol.for('@dotcom-tool-kit/types/base')
const taskSymbol = Symbol.for('@dotcom-tool-kit/types/task')
const hookSymbol = Symbol.for('@dotcom-tool-kit/types/hook')

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
  static is<T extends Base>(something: any): something is T {
    return something[typeSymbol] === this[typeSymbol]
  }

  static isCompatible<T extends Base>(something: unknown): something is T {
    if (!this.is(something)) {
      return false
    }

    // something from a plugin is compatible with this CLI if its version
    // is semver-compatible with the @dotcom-tool-kit/types included
    // by the CLI (which is what's calling this). so, prepend ^ to
    // our version, and check our version satisfies that.

    // this lets e.g. a CLI that includes types@2.2.0 load any plugin
    // that depends on any higher minor version of types.
    const range = `^${this.version}`
    return semver.satisfies(something.version, range)
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
