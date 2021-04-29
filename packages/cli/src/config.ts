import path from 'path'

import type { CommandClass } from './command'
import type { LifecycleAssignment, LifecycleClass } from './lifecycle'
import type { Plugin } from './plugin'
import { Conflict, findConflicts } from './conflict'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { formatCommandConflicts, formatLifecycleAssignmentConflicts, formatLifecycleConflicts, formatOptionConflicts } from './messages'
import HelpCommand from './commands/help'
import LifecycleCommand from './commands/lifecycle'
import InstallCommand from './commands/install'

export interface PluginOptions {
  options: Record<string, unknown>
   plugin: Plugin
   forPlugin: Plugin
}

export interface Config {
   root: string
   findCommand(): boolean
  plugins: { [id: string]: Plugin }
  commands: { [id: string]: CommandClass | Conflict<CommandClass> }
  lifecycleAssignments: { [id: string]: LifecycleAssignment | Conflict<LifecycleAssignment> }
   options: { [id: string]: PluginOptions | Conflict<PluginOptions> },
   lifecycles: { [id:string]: LifecycleClass | Conflict<LifecycleClass> }
}

export interface ValidConfig extends Config {
  commands: { [id: string]: CommandClass }
   lifecycleAssignments: { [id: string]: LifecycleAssignment }
   options: { [id: string]: PluginOptions }
   lifecycles: { [id: string]: LifecycleClass }
}

const coreRoot = path.resolve(__dirname, '../')

export const config: Config = {
   root: coreRoot,
   findCommand: () => false,
   plugins: {},
   commands: {
      help: HelpCommand,
      lifecycle: LifecycleCommand,
      install: InstallCommand
   },
   lifecycleAssignments: {},
   options: {},
   lifecycles: {}
}

export function validateConfig(config: Config): asserts config is ValidConfig {
   const lifecycleAssignmentConflicts = findConflicts(Object.values(config.lifecycleAssignments))
   const lifecycleConflicts = findConflicts(Object.values(config.lifecycles))
   const commandConflicts = findConflicts(Object.values(config.commands))
   const optionConflicts = findConflicts(Object.values(config.options))

   if(
      lifecycleConflicts.length > 0 ||
      lifecycleAssignmentConflicts.length > 0 ||
      commandConflicts.length > 0 ||
      optionConflicts.length > 0
   ) {
      const error = new ToolKitError('There are problems with your Tool Kit configuration.')
      error.details = ''

    if (lifecycleConflicts.length) {
         error.details += formatLifecycleConflicts(lifecycleConflicts)
      }

      if(lifecycleAssignmentConflicts.length) {
         error.details += formatLifecycleAssignmentConflicts(lifecycleAssignmentConflicts)
      }

    if (commandConflicts.length) {
         error.details += formatCommandConflicts(commandConflicts)
      }

    if (optionConflicts.length) {
         error.details += formatOptionConflicts(optionConflicts)
      }

      throw error
   }
}
