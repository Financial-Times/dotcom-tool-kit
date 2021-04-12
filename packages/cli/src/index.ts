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
   plugin: Plugin
   commands: string[]
   unambiguous: boolean
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

async function loadPlugin(id: string, parent?: Plugin): Promise<Plugin> {
   // don't load duplicate commands
   if (id in config.plugins) {
      return config.plugins[id]
   }

   const root = parent ? parent.root : process.cwd()

   // load plugin relative to the app or parent plugin
   // TODO load error handling
   const pluginRoot = resolveFrom(root, id)
   const plugin = importFrom.silent(root, id) as Plugin

   config.plugins[id] = plugin
   plugin.id = id
   plugin.root = pluginRoot
   plugin.parent = parent

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
   await loadPlugins(plugins, plugin)

   // load plugin lifecycle assignments. do this after loading child plugins, so
   // parent lifecycles get assigned after child lifecycles and can override them
   mergeWith(
      config.lifecycles,
      lifecycles,

      // handle conflicts between parents and children
      (existingLifecycle: Lifecycle, configLifecycle: string | string[], id) => {
         const newLifecycle: Lifecycle = {
            plugin,
            commands: Array.isArray(configLifecycle) ? configLifecycle : [configLifecycle],
            unambiguous: Array.isArray(configLifecycle)
         }

         // TODO this is incorrect! parents should always override children, but _siblings_ should conflict. needs rewriting because currently can't consider siblings

         // - this lifecycle might not have been set yet, in which case childLifecycle
         // will be undefined, so use the parentLifecycle.
         // - apps and plugins can disambiguate a conflicting lifecycle by providing
         // an array, which tells the runner what order to run the commands in.
         if(!existingLifecycle || newLifecycle.unambiguous) {
            return newLifecycle
         }

         // if we're here, it's because these things are true:
         //   - there is a parent lifecycle with the same name as a child lifecycle
         //   - the parent lifecycle isn't an array for disambiguation

         // so, any other case is a conflict. any conflicts left in the lifecycles
         // object will be noticed by the validator, which will throw a helpful error
         return conflict(newLifecycle, existingLifecycle)
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

function validateConfig(config: Config): asserts config is ValidConfig {
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
