import { Hook, Plugin, IConfig, PJSON } from '@oclif/config' // eslint-disable-line no-unused-vars
import readPkgUp from 'read-pkg-up'

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

const hook: Hook.Init = async function ({ config, ...options }) {
  if (!canLoadPlugins(config)) return

  const result = await readPkgUp()
  if (!result) return

  const { pjson } = config
  if (!isAppPluginPJSON(pjson)) {
    throw new Error(
      `${pjson.name} doesn't have an oclif.appPlugins.prefix property. this is required to load plugins with this plugin`
    )
  }

  const { devDependencies = {} } = result.packageJson
  const plugins = Object.keys(devDependencies).filter((dep) => dep.startsWith(pjson.oclif.appPlugins.prefix))

  await config.loadPlugins(process.cwd(), 'app', plugins)

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

export default hook
