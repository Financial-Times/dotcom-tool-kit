import type { Plugin } from '@dotcom-tool-kit/types'

export interface CommandTask {
  id: string
  plugin: Plugin
  tasks: string[]
}
