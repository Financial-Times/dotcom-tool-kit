import { ToolKitError } from '@dotcom-tool-kit/error'
import isPlainObject from 'lodash.isplainobject'
import mapValues from 'lodash.mapvalues'
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

export type TaskClass = typeof Task

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

export interface RawRCFile {
  plugins?: string[] | null
  hooks?: { [id: string]: string | string[] } | null
  options?: { [id: string]: Record<string, unknown> } | null
}

export interface RCFile {
  plugins: string[]
  hooks: { [id: string]: string | string[] }
  options: { [id: string]: Record<string, unknown> }
}

export interface Plugin {
  id: string
  root: string
  parent?: Plugin
  tasks?: TaskClass[]
  hooks?: {
    [id: string]: Hook
  }
}

export interface RawPlugin extends Omit<Plugin, 'parent' | 'hooks'> {
  parent?: RawPlugin
  hooks?: {
    [id: string]: { new (logger: Logger): Hook }
  }
}

export function instantiatePlugin(plugin: unknown, logger: Logger): Plugin {
  const rawPlugin = plugin as RawPlugin

  const parent = rawPlugin.parent && instantiatePlugin(rawPlugin.parent, logger)

  if (
    rawPlugin.tasks &&
    !(Array.isArray(rawPlugin.tasks) && rawPlugin.tasks.every((task) => task.prototype instanceof Task))
  ) {
    throw new ToolKitError('tasks are not valid')
  }

  if (
    rawPlugin.hooks &&
    !(
      isPlainObject(rawPlugin.hooks) &&
      Object.values(rawPlugin.hooks).every((hook) => hook.prototype instanceof Hook)
    )
  ) {
    throw new ToolKitError('hooks are not valid')
  }

  const hooks = mapValues(rawPlugin.hooks, (Hook) => {
    return new Hook(logger)
  })
  return { ...rawPlugin, parent, hooks }
}
