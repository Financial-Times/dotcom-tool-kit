import type { Plugin } from './plugin'

export interface LifecycleAssignment {
  id: string
  plugin: Plugin
  commands: string[]
}
