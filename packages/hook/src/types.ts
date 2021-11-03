import { TaskClass, Task } from '@dotcom-tool-kit/task'
import { ToolKitError } from '@dotcom-tool-kit/error'
import isPlainObject from 'lodash.isplainobject'
import mapValues from 'lodash.mapvalues'

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

export abstract class Hook {
  id?: string
  plugin?: Plugin
  static description?: string

  abstract check(): Promise<boolean>
  abstract install(): Promise<void>
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
