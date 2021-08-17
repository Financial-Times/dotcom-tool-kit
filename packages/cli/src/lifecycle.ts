import type { Plugin } from './plugin'
import { TaskClass } from './task'

export interface LifecycleAssignment {
  id: string
  plugin: Plugin
  tasks: string[]
}

export interface LifecycleClass {
  id?: string
  plugin?: Plugin
  new (): Lifecycle
}

export interface Lifecycle {
  check(): Promise<boolean>
  install(): Promise<void>
}
