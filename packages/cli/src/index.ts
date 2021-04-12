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
      for(const lifecycle of this.argv) {
         const commands = config.lifecycles[lifecycle]

         if(Array.isArray(commands)) {
            for(const command of commands) {
               await runCommand(command, [])
            }
         } else if(typeof commands === 'string') {
            await runCommand(commands, [])
         }
      }
   }
}

type UnconflictedLifecycle = string | string[]
type Lifecycle = UnconflictedLifecycle | Conflict<UnconflictedLifecycle>

type Config = {
   root: string
   findCommand(): boolean
   plugins: { [id: string]: Plugin },
   commands: { [id: string]: CommandClass | Conflict<CommandClass> },
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
   lifecycles: { [id: string]: Lifecycle }
}

interface CommandClass {
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
   commands: {
      [id: string]: CommandClass
   }
}

type Conflict<T> = {
   conflicting: T[]
}

// TODO more information for better error message
function conflict<T>(a: T, b: T): Conflict<T> {
   return { conflicting: [a, b] }
}

function isConflict<T>(thing: any): thing is Conflict<T> {
   return thing.conflicting != null
}

async function loadToolKitConfig(root: string): Promise<ConfigFile> {
   const result = await explorer.search(root)
   if (!result) return { plugins: [], lifecycles: {} }

   return result.config as ConfigFile
}

async function loadPlugin(id: string, root: string): Promise<Plugin> {
   // don't load duplicate commands
   if (id in config.plugins) {
      return config.plugins[id]
   }

   // load plugin relative to the app or parent plugin
   // TODO load error handling
   const pluginRoot = resolveFrom(root, id)
   const plugin = importFrom.silent(root, id) as Plugin

   config.plugins[id] = plugin
   plugin.id = id
   plugin.root = pluginRoot

   const { plugins = [], lifecycles = {} } = await loadToolKitConfig(pluginRoot)

   mergeWith(
      config.commands,
      plugin.commands,

      (existingCommand: CommandClass, newCommand: CommandClass, commandId) => {
         if(!existingCommand) {
            return newCommand
         }

         return conflict(existingCommand, newCommand)
      }
   )

   // load any plugins requested by this plugin
   await loadPlugins(plugin.root, plugins)

   // load plugin lifecycle assignments. do this after loading child plugins, so
   // parent lifecycles get assigned after child lifecycles and can override them
   mergeWith(
      config.lifecycles,
      lifecycles,

      // handle conflicts between parents and children
      (childLifecycle: Lifecycle, parentLifecycle: Lifecycle, id) => {
         // TODO this is incorrect! parents should always override children, but _siblings_ should conflict. needs rewriting because currently can't consider siblings

         // - this lifecycle might not have been set yet, in which case childLifecycle
         // will be undefined, so use the parentLifecycle.
         // - apps and plugins can disambiguate a conflicting lifecycle by providing
         // an array, which tells the runner what order to run the commands in.
         if(!childLifecycle || Array.isArray(parentLifecycle)) {
            return parentLifecycle
         }

         // if we're here, it's because these things are true:
         //   - there is a parent lifecycle with the same name as a child lifecycle
         //   - the parent lifecycle isn't an array for disambiguation

         // so, any other case is a conflict. any conflicts left in the lifecycles
         // object will be noticed by the validator, which will throw a helpful error
         return conflict(parentLifecycle, childLifecycle)
      }
   )

   return plugin
}

function loadPlugins(root: string, plugins: string[]) {
   return Promise.all(plugins.map(
      plugin => loadPlugin(plugin, root)
   ))
}

async function loadPluginsFromConfig(root: string) {
   const { plugins = [] } = await loadToolKitConfig(root)
   return loadPlugins(root, plugins)
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

function validateConfig() {
   const lifecycleConflicts = findConflicts(Object.values(config.lifecycles))
   const commandConflicts = findConflicts(Object.values(config.commands))

   if(lifecycleConflicts.length > 0 || commandConflicts.length > 0) {
      // TODO real helpful error message
      throw new Error(util.inspect({ lifecycleConflicts, commandConflicts }, { depth: null, colors: true }))
   }
}

export async function load() {
   await loadPluginsFromConfig(coreRoot)
   await loadPluginsFromConfig(appRoot)

   validateConfig()
   return config
}

export async function runCommand(id: string, argv: string[]) {
   if(!(id in config.commands)) {
      throw new Error(`command "${id}" not found`)
   }

   const Command = config.commands[id]

   if(isConflict(Command)) {
      throw new Error(`conflict`)
   }

   const command = new Command(argv)

   // dummy oclif config so @oclif/command's init doesn't crash
   command.config = {}

   if(command.init != null) {
      await command.init()
   }

   return command.run()
}
