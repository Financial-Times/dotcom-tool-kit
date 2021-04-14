import path from 'path'

import type { CommandClass } from './command'
import type { Lifecycle } from './lifecycle'
import type { Plugin } from './plugin'
import { Conflict, findConflicts } from './conflict'
import { ToolKitError } from './error'
import { formatCommandConflicts, formatLifecycleConflicts } from './messages'
import HelpCommand from './commands/help'
import LifecycleCommand from './commands/lifecycle'

export interface Config {
   root: string
   findCommand(): boolean
   plugins: { [id: string]: Plugin },
   commands: { [id: string]: CommandClass | Conflict<CommandClass> },
   lifecycles: { [id: string]: Lifecycle | Conflict<Lifecycle> }
}

export interface ValidConfig extends Config {
   commands: { [id: string]: CommandClass },
   lifecycles: { [id: string]: Lifecycle }
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
   lifecycles: {}
}

export function validateConfig(config: Config): asserts config is ValidConfig {
   const lifecycleConflicts = findConflicts(Object.values(config.lifecycles))
   const commandConflicts = findConflicts(Object.values(config.commands))

   if(lifecycleConflicts.length > 0 || commandConflicts.length > 0) {
      const error = new ToolKitError('There are problems with your Tool Kit configuration.')
      error.details = ''

      if(lifecycleConflicts.length) {
         error.details += formatLifecycleConflicts(lifecycleConflicts)
      }

      if(commandConflicts.length) {
         error.details += formatCommandConflicts(commandConflicts)
      }

      throw error
   }
}
