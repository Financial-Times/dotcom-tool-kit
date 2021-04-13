import { cli } from 'cli-ux'
import { error, exit } from '@oclif/errors'
import { cosmiconfig } from 'cosmiconfig'
import importFrom from 'import-from'
import resolveFrom from 'resolve-from'
import path from 'path'
import mergeWith from 'lodash.mergewith'
import util from 'util'

const explorer = cosmiconfig('toolkit')

const coreRoot = path.resolve(__dirname, '../')
const appRoot = process.cwd()

class HelpCommand implements Command {
   static description = 'show this help'

   constructor(public argv: string[]) {}

   showHelp() {
      for(const [id, command] of Object.entries(config.commands)) {
         if(isConflict(command) || command.hidden) continue

         console.log(`${id}\t${command.description}`)
      }
   }

   showCommandHelp(id: string) {
      const command = config.commands[id]
      if(isConflict(command)) return

      // TODO print argument help somehow?
      console.log(`${id}\t${command.description}`)
   }

   async run() {
      const [id] = this.argv

      if(id) {
         this.showCommandHelp(id)
      } else {
         this.showHelp()
      }
   }
}

class LifecycleCommand implements Command {
   static description = 'run lifecycle commands'

   constructor(public argv: string[]) {}

   async run() {
      for(const id of this.argv) {
         const lifecycle = config.lifecycles[id]

         if(isConflict(lifecycle)) continue

         for(const command of lifecycle.commands) {
            await runCommand(command, [])
         }
      }
   }
}

interface Lifecycle {
   id: string
   plugin: Plugin
   commands: string[]
}

type Config = {
   root: string
   findCommand(): boolean
   plugins: { [id: string]: Plugin },
   commands: { [id: string]: CommandClass | Conflict<CommandClass> },
   lifecycles: { [id: string]: Lifecycle | Conflict<Lifecycle> }
}

interface ValidConfig extends Config {
   commands: { [id: string]: CommandClass },
   lifecycles: { [id: string]: Lifecycle }
}

const config: Config = {
   root: coreRoot,
   findCommand: () => false,
   plugins: {},
   commands: {
      help: HelpCommand,
      lifecycle: LifecycleCommand
   },
   lifecycles: {}
}

interface ConfigFile {
   plugins: string[],
   lifecycles: { [id: string]: string | string[] }
}

interface CommandClass {
   id?: string
   plugin?: Plugin
   description: string
   hidden?: boolean
   new(argv: string[]): Command
}

interface Command {
   config?: Object
   init?(): Promise<void>
   run(): Promise<void>
}

interface Plugin {
   id: string
   root: string
   parent?: Plugin
   commands: {
      [id: string]: CommandClass
   }
}

type Conflict<T> = {
   plugin: Plugin,
   conflicting: T[]
}

function isConflict<T>(thing: any): thing is Conflict<T> {
   return thing.conflicting != null
}

async function loadToolKitConfig(root: string): Promise<ConfigFile> {
   const result = await explorer.search(root)
   if (!result) return { plugins: [], lifecycles: {} }

   return result.config as ConfigFile
}

async function loadPlugin(id: string, parent?: Plugin): Promise<Plugin> {
   // don't load duplicate commands
   if (id in config.plugins) {
      return config.plugins[id]
   }

   const root = parent ? parent.root : process.cwd()

   // load plugin relative to the app or parent plugin
   // TODO load error handling
   const pluginRoot = resolveFrom(root, id)
   const basePlugin = importFrom.silent(root, id) as Plugin
   const plugin: Plugin = {
      ...basePlugin,
      id,
      root: pluginRoot,
      parent
   }

   config.plugins[id] = plugin

   const { plugins = [], lifecycles = {} } = await loadToolKitConfig(pluginRoot)

   mergeWith(
      config.commands,
      plugin.commands,

      (existingCommand: CommandClass | Conflict<CommandClass>, newCommand: CommandClass, commandId): CommandClass | Conflict<CommandClass> => {
         newCommand.plugin = plugin
         newCommand.id = commandId

         if(!existingCommand) {
            return newCommand
         }

         const conflicting = isConflict(existingCommand)
            ? existingCommand.conflicting
            : [existingCommand]

         return {
            plugin,
            conflicting: conflicting.concat(newCommand)
         }
      }
   )

   // load any plugins requested by this plugin
   await loadPlugins(plugins, plugin)

   // load plugin lifecycle assignments. do this after loading child plugins, so
   // parent lifecycles get assigned after child lifecycles and can override them
   mergeWith(
      config.lifecycles,
      lifecycles,

      // handle conflicts between lifecycles from different plugins
      (existingLifecycle: Lifecycle | Conflict<Lifecycle> | undefined, configLifecycle: string | string[], id): Lifecycle | Conflict<Lifecycle> => {
         const newLifecycle: Lifecycle = {
            id,
            plugin,
            commands: Array.isArray(configLifecycle) ? configLifecycle : [configLifecycle],
         }

         // this lifecycle might not have been set yet, in which case use the new one
         if(!existingLifecycle) {
            return newLifecycle
         }

         const existingFromSibling = existingLifecycle.plugin.parent && existingLifecycle.plugin.parent === plugin.parent

         // if the existing lifecycle was from a sibling, that's a conflict
         // return a conflict either listing this lifecycle and the siblings,
         // or merging in a previously-generated lifecycle
         if(existingFromSibling) {
            const conflicting = isConflict(existingLifecycle)
               ? existingLifecycle.conflicting
               : [existingLifecycle]

            const conflict: Conflict<Lifecycle> = {
               plugin,
               conflicting: conflicting.concat(newLifecycle)
            }

            return conflict
         }

         // if we're here, any existing lifecycle is from a child plugin,
         // so the parent always overrides it
         return newLifecycle
      }
   )

   return plugin
}

function loadPlugins(plugins: string[], parent?: Plugin) {
   return Promise.all(plugins.map(
      plugin => loadPlugin(plugin, parent)
   ))
}

async function loadPluginsFromConfig(root: string) {
   const { plugins = [] } = await loadToolKitConfig(root)
   return loadPlugins(plugins)
}

function findConflicts<T, U>(items: (U | Conflict<T>)[]): Conflict<T>[] {
   const conflicts:Conflict<T>[] = []

   for(const item of items) {
      if(isConflict<T>(item)) {
         conflicts.push(item)
      }
   }

   return conflicts
}

// TODO use chalk for colour & formatting
const formatCommandConflict = (conflict: Conflict<CommandClass>) => `- ${conflict.conflicting[0].id} from plugins ${conflict.conflicting.map(command => command.plugin ? command.plugin.id : 'unknown plugin').join(', ')}`

const formatCommandConflicts = (conflicts: Conflict<CommandClass>[]) => `There are multiple plugins that include the same commands:
${conflicts.map(formatCommandConflict).join('\n')}

You must resolve this conflict by removing all but one of these plugins.`

const formatLifecycleConflict = (conflict: Conflict<Lifecycle>) => `${conflict.conflicting[0].id}:
${conflict.conflicting.map(lifecycle => `- ${lifecycle.commands.join(', ')} by plugin ${lifecycle.plugin.id}`).join('\n')}
`

const formatLifecycleConflicts = (conflicts: Conflict<Lifecycle>[]) => `These lifecycle events are assigned to different commands by multiple plugins:

${conflicts.map(formatLifecycleConflict).join('\n')}
You must resolve this conflict by explicitly configuring which command to use for these events. See https://github.com/financial-times/dotcom-tool-kit/wiki/Resolving-Lifecycle-Conflicts for more details.

`

class ToolKitError extends Error {
   details?: string
}

function validateConfig(config: Config): asserts config is ValidConfig {
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

export async function load() {
   await loadPluginsFromConfig(coreRoot)
   await loadPluginsFromConfig(appRoot)

   validateConfig(config)
   return config
}

export async function runCommand(id: string, argv: string[]) {
   validateConfig(config)

   if(!(id in config.commands)) {
      // TODO improve error message
      throw new Error(`command "${id}" not found`)
   }

   const Command = config.commands[id]
   const command = new Command(argv)

   // dummy oclif config so @oclif/command's init doesn't crash
   command.config = {}

   if(command.init != null) {
      await command.init()
   }

   return command.run()
}
