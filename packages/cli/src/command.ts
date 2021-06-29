import type { Command } from '@dotcom-tool-kit/command'
import type { Plugin } from './plugin'

export interface CommandClass {
  id?: string
  plugin?: Plugin
  description: string
  hidden?: boolean
  new (argv: string[]): Command
}
