import { cli } from 'cli-ux'
import { error, exit } from '@oclif/errors'
import { cosmiconfig } from 'cosmiconfig'
import importFrom from 'import-from'
import resolveFrom from 'resolve-from'
import path from 'path'

const explorer = cosmiconfig('toolkit')

const coreRoot = path.resolve(__dirname, '../')
const appRoot = process.cwd()

class HelpCommand implements Command {
   static description = 'show this help'

   constructor(public argv: string[]) {}

   showHelp() {
      for(const [id, command] of Object.entries(config.commands)) {
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

type Config = {
   root: string
   findCommand(): boolean
   plugins: { [id: string]: Plugin },
   commands: { [id: string]: CommandClass },
}

const config: Config = {
   root: coreRoot,
   findCommand: () => false,
   plugins: {},
   commands: {
      help: HelpCommand
   }
}

interface CommandClass {
   description: string
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

async function findToolKitPlugins(root: string): Promise<string[]> {
   const result = await explorer.search(root)
   if (!result) return []

   const { plugins = [] } = result.config

   return plugins
}

async function loadPlugin(id: string, root: string): Promise<Plugin> {
   // don't load duplicate commands
   if (id in config.plugins) {
      return config.plugins[id]
   }

   // load plugin relative to the app or parent plugin
   const pluginRoot = resolveFrom(root, id)
   const plugin = importFrom.silent(root, id) as Plugin

   config.plugins[id] = plugin
   plugin.id = id
   plugin.root = pluginRoot

   // TODO check duplicate commands
   // TODO lifecycles
   Object.assign(
      config.commands,
      plugin.commands
   )

   // load any plugins requested by this plugin
   await loadPlugins(plugin.root)

   // TODO run init hook(? or just put init code in the plugin entry point)

   return plugin
}

async function loadPlugins(root: string) {
   const plugins = await findToolKitPlugins(root)

   return plugins.map(
      plugin => loadPlugin(plugin, root)
   )
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
   await loadPlugins(coreRoot)
   await loadPlugins(appRoot)

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
