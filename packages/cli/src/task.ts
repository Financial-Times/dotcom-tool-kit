import type { Task } from '@dotcom-tool-kit/task'
import type { Plugin } from './plugin'

export interface TaskClass<O extends Record<string, unknown> = Record<string, unknown>> {
  id?: string
  plugin?: Plugin
  description: string
  hidden?: boolean
  options?: O
  new (options: O): Task
}
