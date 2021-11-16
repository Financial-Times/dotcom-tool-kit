import { ToolKitError } from '@dotcom-tool-kit/error'
import isPlainObject from 'lodash.isplainobject'
import mapValues from 'lodash.mapvalues'
import { Schema, SchemaOutput } from './schema'

export abstract class Task<O extends Schema = Record<string, never>> {
  static description: string
  // plugin is set by the CLI package to a type it defines.
  // we could extract it into a package, but for now:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static plugin?: any
  static id?: string

  static defaultOptions: Record<string, unknown> = {}
  options: SchemaOutput<O>

  constructor(options: Partial<SchemaOutput<O>> = {}) {
    this.options = Object.assign(
      {},
      (this.constructor as typeof Task).defaultOptions as SchemaOutput<O>,
      options
    )
  }

  abstract run(files?: string[]): Promise<void>
}

export type TaskClass = typeof Task

export abstract class Hook {
  id?: string
  plugin?: Plugin
  static description?: string

  abstract check(): Promise<boolean>
  abstract install(): Promise<void>
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
    [id: string]: { new (): Hook }
  }
}

export function instantiatePlugin(plugin: unknown): Plugin {
  const rawPlugin = plugin as RawPlugin

  const parent = rawPlugin.parent && instantiatePlugin(rawPlugin.parent)

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
    return new Hook()
  })
  return { ...rawPlugin, parent, hooks }
}
