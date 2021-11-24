import type { Plugin } from '@dotcom-tool-kit/types'

export interface HookTask {
  id: string
  plugin: Plugin
  tasks: string[]
}
