import type { Plugin } from './plugin'

export interface Lifecycle {
   id: string
   plugin: Plugin
   commands: string[]
}
