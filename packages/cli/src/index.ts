import { cli } from 'cli-ux'
import { error, exit } from '@oclif/errors'
import { cosmiconfig } from 'cosmiconfig'
import importFrom from 'import-from'
import resolveFrom from 'resolve-from'
import path from 'path'
import mergeWith from 'lodash.mergewith'

const explorer = cosmiconfig('toolkit')

const coreRoot = path.resolve(__dirname, '../')
const appRoot = process.cwd()

class HelpCommand implements Command {
   static description = 'show this help'

   constructor(public argv: string[]) {}

   showHelp() {
      for(const [id, command] of Object.entries(config.commands)) {
         if(command.hidden) continue

         console.log(`${id}\t${command.description}`)
      }
   }

   showCommandHelp(id: string) {
      const command = config.commands[id]

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

type Lifecycle = string | string[] | LifecycleConflict

type Config = {
   root: string
   findCommand(): boolean
   plugins: { [id: string]: Plugin },
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

type LifecycleConflict = {
   conflicting: [Lifecycle, Lifecycle]
}

// TODO more information for better error message
function lifecycleConflict(a: Lifecycle, b: Lifecycle): LifecycleConflict {
   return { conflicting: [a, b] }
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

   // TODO check duplicate commands
   Object.assign(
      config.commands,
      plugin.commands
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
         return lifecycleConflict(parentLifecycle, childLifecycle)
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

function validatePlugins() {
   // TODO reimplement
   const duplicateCommands: [string, string[]][] = []

   if (duplicateCommands.length !== 0) {
      console.log(`Error: you have multiple plugins installed that have conflicting commands, which isn't allowed. remove all but one of these plugins from your app's package.json:\n`)

      cli.table(duplicateCommands, {
         plugins: { get: row => row[1].join(', ') + '   ' },
         command: { get: row => row[0] },
      })

      exit(1)
   }
}

export async function load() {
   await loadPluginsFromConfig(coreRoot)
   await loadPluginsFromConfig(appRoot)

   validatePlugins()
   return config
}

export async function runCommand(id: string, argv: string[]) {
   // TODO running help
   if(!(id in config.commands)) {
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
