import { cli } from 'cli-ux'
import { error, exit } from '@oclif/errors'
import { cosmiconfig } from 'cosmiconfig'
import importFrom from 'import-from'
import resolveFrom from 'resolve-from'

const explorer = cosmiconfig('toolkit')

const config = {
   plugins: new Map
}

interface Plugin {
   root: string
}

async function findToolKitPlugins(root: string): Promise<string[]> {
  const result = await explorer.search(root)
  if (!result) return []

  const { plugins = [] } = result.config

  return plugins
}

async function loadPlugin(plugin: string, root: string): Promise<Plugin> {
   // don't
   if(config.plugins.has(plugin)) {
      return config.plugins.get(plugin)
   }

   // load plugin relative to the app or parent plugin
   const pluginRoot = resolveFrom(root, plugin)
   const loaded = importFrom(root, plugin) as Plugin

   config.plugins.set(plugin, loaded)
   loaded.root = pluginRoot

   // load any plugins requested by this plugin
   await loadPlugins(loaded.root)

   // TODO run init hook(? or just put init code in the plugin entry point)

   return loaded
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
}

// TODO register commands, command runner
