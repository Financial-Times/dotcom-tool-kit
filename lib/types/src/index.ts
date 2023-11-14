import type { HookConstructor } from './hook'
import type { TaskConstructor } from './task'

export * from './validated'
export * from './task'
export * from './hook'

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
