import { styles as s } from '@dotcom-tool-kit/logger'
import fs from 'fs'
import path from 'path'
import semver from 'semver'
import type { Logger } from 'winston'
import { z } from 'zod'
import { Validated } from './validated'

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

export * from './validated'

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

export abstract class Task<O extends z.ZodTypeAny = z.ZodTypeAny> extends Base {
  static description: string
  id: string

  static get [typeSymbol](): symbol {
    return taskSymbol
  }

  get [typeSymbol](): symbol {
    return taskSymbol
  }

  options: z.output<O>
  logger: Logger

  constructor(logger: Logger, id: string, options: z.output<O>) {
    super()

    this.id = id
    this.options = options
    this.logger = logger.child({ task: id })
  }

  abstract run(files?: string[]): Promise<void>
}

export type TaskConstructor = {
  new <O extends z.ZodTypeAny>(logger: Logger, id: string, options: Partial<z.infer<O>>): Task<O>
}

export type TaskClass = TaskConstructor & typeof Task

export abstract class Hook<State = void> extends Base {
  logger: Logger
  static description?: string
  id: string
  // This field is used to collect hooks that share state when running their
  // install methods. All hooks in the same group will run their install method
  // one after the other, and then their commitInstall method will be run with
  // the collected state.
  installGroup?: string

  static get [typeSymbol](): symbol {
    return hookSymbol
  }

  get [typeSymbol](): symbol {
    return hookSymbol
  }

  constructor(logger: Logger, id: string) {
    super()

    this.id = id
    this.logger = logger.child({ hook: this.constructor.name })
  }

  abstract check(): Promise<boolean>
  abstract install(state?: State): Promise<State>
  // Intentional unused parameter as pre-fixed with an underscore
  // eslint-disable-next-line no-unused-vars
  async commitInstall(_state: State): Promise<void> {
    return
  }
}

export type HookConstructor = { new (logger: Logger, id: string): Hook<void> }

export type RCFile = {
  plugins: string[]
  installs: string[]
  tasks: string[]
  hooks: { [id: string]: string | string[] }
  options: { [id: string]: Record<string, unknown> }
}

export interface Plugin {
  id: string
  root: string
  rcFile?: RCFile
  parent?: Plugin
  children?: Plugin[]
}

export interface PluginModule {
  tasks: {
    [id: string]: TaskConstructor
  }
  hooks: {
    [id: string]: HookConstructor
  }
}
