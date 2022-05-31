import type { Logger } from 'winston'
import { Schema, SchemaOutput } from './schema'

export abstract class Task<O extends Schema = Record<string, never>> {
  static description: string
  static plugin?: Plugin
  static id?: string

  static defaultOptions: Record<string, unknown> = {}
  options: SchemaOutput<O>
  logger: Logger

  constructor(logger: Logger, options: Partial<SchemaOutput<O>> = {}) {
    const staticThis = this.constructor as typeof Task
    this.options = Object.assign({}, staticThis.defaultOptions as SchemaOutput<O>, options)
    this.logger = logger.child({ task: staticThis.id })
  }

  abstract run(files?: string[]): Promise<void>
}

export type TaskClass = {
  new <O extends Schema>(logger: Logger, options: Partial<SchemaOutput<O>>): Task<O>
} & typeof Task

export abstract class Hook {
  id?: string
  plugin?: Plugin
  logger: Logger
  static description?: string

  constructor(logger: Logger) {
    this.logger = logger.child({ hook: this.constructor.name })
  }

  abstract check(): Promise<boolean>
  abstract install(): Promise<void>
}

export type HookClass = { new (logger: Logger): Hook } & typeof Hook

export interface RawRCFile {
  plugins?: string[] | null
  hooks?: { [id: string]: string | string[] } | null
  options?: { [id: string]: Record<string, unknown> } | null
}

export type RCFile = {
  [key in keyof RawRCFile]-?: NonNullable<RawRCFile[key]>
}

export interface Plugin {
  id: string
  root: string
  rcFile?: RCFile
  module?: PluginModule
  parent?: Plugin
  children?: Plugin[]
}

export interface RawPluginModule {
  tasks?: TaskClass[]
  hooks?: {
    [id: string]: HookClass
  }
}

export type PluginModule = Required<RawPluginModule>
