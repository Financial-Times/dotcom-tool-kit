import path from 'path'

import type { CommandClass } from './command'
import type { Lifecycle } from './lifecycle'
import type { Plugin } from './plugin'
import { Conflict, findConflicts } from './conflict'
import { ToolKitError } from './error'
import { formatCommandConflicts, formatLifecycleConflicts, formatOptionConflicts } from './messages'
import HelpCommand from './commands/help'
import LifecycleCommand from './commands/lifecycle'

export interface PluginOptions {
   options: Object
   plugin: Plugin
   forPlugin: Plugin
}

export interface Config {
   root: string
   findCommand(): boolean
   plugins: { [id: string]: Plugin },
   commands: { [id: string]: CommandClass | Conflict<CommandClass> },
   lifecycles: { [id: string]: Lifecycle | Conflict<Lifecycle> },
   options: { [id: string]: PluginOptions | Conflict<PluginOptions> }
}

export interface ValidConfig extends Config {
   commands: { [id: string]: CommandClass },
   lifecycles: { [id: string]: Lifecycle }
   options: { [id: string]: PluginOptions }
}

const coreRoot = path.resolve(__dirname, '../')

export const config: Config = {
   root: coreRoot,
   findCommand: () => false,
   plugins: {},
   commands: {
      help: HelpCommand,
      lifecycle: LifecycleCommand
   },
   lifecycles: {},
   options: {}
}

export function validateConfig(config: Config): asserts config is ValidConfig {
   const lifecycleConflicts = findConflicts(Object.values(config.lifecycles))
   const commandConflicts = findConflicts(Object.values(config.commands))
   const optionConflicts = findConflicts(Object.values(config.options))

   if(lifecycleConflicts.length > 0 || commandConflicts.length > 0 || optionConflicts.length > 0) {
      const error = new ToolKitError('There are problems with your Tool Kit configuration.')
      error.details = ''

      if(lifecycleConflicts.length) {
         error.details += formatLifecycleConflicts(lifecycleConflicts)
      }

      if(commandConflicts.length) {
         error.details += formatCommandConflicts(commandConflicts)
      }

      if(optionConflicts.length) {
         error.details += formatOptionConflicts(optionConflicts)
      }

      throw error
   }
}
