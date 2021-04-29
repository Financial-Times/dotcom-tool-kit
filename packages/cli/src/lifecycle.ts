import type { Plugin } from './plugin'

export interface LifecycleAssignment {
  id: string
  plugin: Plugin
  commands: string[]
}

export interface LifecycleClass {
   id?: string
   plugin?: Plugin
   new(): Lifecycle
}

export interface Lifecycle {
   verify(): Promise<boolean>
   install(): Promise<void>
}
