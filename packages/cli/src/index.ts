import { cli } from 'cli-ux'
import { error, exit } from '@oclif/errors'
import { cosmiconfig } from 'cosmiconfig'
import importFrom from 'import-from'
import resolveFrom from 'resolve-from'

const explorer = cosmiconfig('toolkit')

type Config = {
   plugins: { [id: string]: Plugin },
   commands: { [id: string]: CommandClass },
}

const config: Config = {
   plugins: {},
   commands: {}
}

interface CommandClass {
   new(argv: string[]): Command
}

interface Command {
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
   if(id in config.plugins) {
      return config.plugins[id]
   }

   // load plugin relative to the app or parent plugin
   const pluginRoot = resolveFrom(root, id)
   const plugin = importFrom(root, id) as Plugin

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

async function loadPlugins(root = process.cwd()) {
   const plugins = await findToolKitPlugins(root)

   return plugins.map(
      plugin => loadPlugin(plugin, root)
   )
}

function validatePlugins() {
   // TODO reimplement
   const duplicateCommands: [string, string[]][] = []

  if(duplicateCommands.length !== 0) {
    console.log(`Error: you have multiple plugins installed that have conflicting commands, which isn't allowed. remove all but one of these plugins from your app's package.json:\n`)

    cli.table(duplicateCommands, {
      plugins: { get: row => row[1].join(', ') + '   ' },
      command: { get: row => row[0] },
    })

    exit(1)
  }
}

export async function load() {
  await loadPlugins()
  validatePlugins()
  return config
}

export async function runCommand(id: string, argv: string[]) {
   // TODO checking command exists, running help
   const Command = config.commands[id]
   const command = new Command(argv)
   return command.run()
}
