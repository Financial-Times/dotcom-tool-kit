import type { Plugin } from './plugin'

export interface CommandClass {
   id?: string
   plugin?: Plugin
   description: string
   hidden?: boolean
   new(argv: string[]): Command
}

export interface Command {
   config?: Object
   init?(): Promise<void>
   run(): Promise<void>
}
