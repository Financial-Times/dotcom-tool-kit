import type { Plugin } from './plugin'

export interface HookTask {
  id: string
  plugin: Plugin
  tasks: string[]
}

export interface HookClass {
  id?: string
  plugin?: Plugin
  description?: string
  new (): Hook
}

export interface Hook {
  check(): Promise<boolean>
  install(): Promise<void>
}
