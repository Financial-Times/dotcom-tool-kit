import type { Task } from '@dotcom-tool-kit/task'
import type { Plugin } from './plugin'

export interface TaskClass {
  id?: string
  plugin?: Plugin
  description: string
  hidden?: boolean
  new (argv: string[]): Task
}
