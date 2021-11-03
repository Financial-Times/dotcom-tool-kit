import type { Plugin } from '@dotcom-tool-kit/hook'

export interface HookTask {
  id: string
  plugin: Plugin
  tasks: string[]
}
