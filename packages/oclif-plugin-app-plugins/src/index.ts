import { Hook, Hooks, Plugin, IConfig, PJSON } from '@oclif/config' // eslint-disable-line no-unused-vars
import { cli } from 'cli-ux'
import { error, exit } from '@oclif/errors'
import { cosmiconfig } from 'cosmiconfig'

const explorer = cosmiconfig('toolkit')

// according to Oclif's type definitions, loadPlugins isn't there on
// options.config. but we know it is. so tell Typescript it can use
// it by using a type predicate function to make it into this interface
interface PluginLoader {
  loadPlugins(root: string, type: string, plugins: string[]): Promise<void> // eslint-disable-line no-unused-vars
}

interface AppPluginPJSON extends PJSON.Plugin {
  oclif: PJSON.Plugin['oclif'] & {
    appPlugins: {
      prefix: string
    }
  }
}

function canLoadPlugins(config: any): config is PluginLoader {
  return typeof config.loadPlugins === 'function'
}

function isAppPluginPJSON(pjson: PJSON.Plugin): pjson is AppPluginPJSON {
  return 'appPlugins' in pjson.oclif
}

async function findToolKitPlugins(pjson: AppPluginPJSON) {
  const result = await explorer.search()
  if (!result) return []

  const { plugins = [] } = result.config

  return plugins
}

async function loadToolKitPlugins(pjson: AppPluginPJSON, config: PluginLoader) {
  const plugins = await findToolKitPlugins(pjson)
  await config.loadPlugins(process.cwd(), 'app', plugins)
}

function validatePlugins(config: IConfig) {
  const pluginsByCommand = new Map()

  for(const plugin of config.plugins) {
    for(const command of plugin.commandIDs) {
      if(!pluginsByCommand.has(command)) {
        pluginsByCommand.set(command, [])
      }

      pluginsByCommand.get(command).push(plugin.name)
    }
  }

  const duplicateCommands = Array.from(pluginsByCommand).filter(
    ([command, plugins]) => plugins.length > 1
  )

  if(duplicateCommands.length !== 0) {
    console.log(`Error: you have multiple plugins installed that have conflicting commands, which isn't allowed. remove all but one of these plugins from your app's package.json:\n`)

    cli.table(duplicateCommands, {
      plugins: { get: row => row[1].join(', ') + '   ' },
      command: { get: row => row[0] },
    })

    exit(1)
  }
}

async function rerunInitHooks(config: IConfig, options: Hooks['init']) {
  const thisPlugin = config.plugins.find(
    (plugin) => plugin.name === '@dotcom-tool-kit/oclif-plugin-app-plugins'
  )

  // remove this hook from our hooks so we don't infinitely recurse
  if (thisPlugin) {
    thisPlugin.hooks.init = []
  }

  // ensure plugins' init hooks are also run
  await config.runHook('init', { ...options })
}

const hook: Hook.Init = async function ({ config, ...options }) {
  if (!canLoadPlugins(config)) return

  const { pjson } = config
  if (!isAppPluginPJSON(pjson)) {
     error(
       new Error(
        `${pjson.name} doesn't have an oclif.appPlugins.prefix property. this is required to load plugins with this plugin`
      ),
      { exit: 1 }
     )
  }

  await loadToolKitPlugins(pjson, config)
  validatePlugins(config)
  await rerunInitHooks(config, options)
}

export default hook
