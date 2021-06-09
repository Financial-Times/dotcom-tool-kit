import type { Plugin } from './plugin'
import { Config } from './config'

export interface CommandClass {
  id?: string
  plugin?: Plugin
  description: string
  hidden?: boolean
  new (argv: string[]): Command
}

export interface Command {
  config?: Config | Record<string, never>
  options?: Record<string, unknown>
  init?(): Promise<void>
  run(): Promise<void>
}
