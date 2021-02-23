import { Hook, Plugin, IConfig, PJSON } from '@oclif/config'
import * as readPkgUp from 'read-pkg-up'

// according to Oclif's type definitions, loadPlugins isn't there on
// options.config. but we know it is. so tell Typescript it can use
// it by using a type predicate function to make it into this interface
interface PluginLoader {
  loadPlugins(root: string, type: string, plugins: string[]): Promise<void>
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

const hook: Hook<'init'> = async function (options) {
  if (!canLoadPlugins(options.config)) return

  const result = await readPkgUp()
  if (!result) return

  const { pjson } = options.config
  if (!isAppPluginPJSON(pjson)) {
    throw new Error(
      `${pjson.name} doesn't have an oclif.appPlugins.prefix property. this is required to load plugins with this plugin`
    )
  }

  const { devDependencies = {} } = result.packageJson
  const plugins = Object.keys(devDependencies).filter((dep) =>
    dep.startsWith(pjson.oclif['appPlugins'].prefix)
  )

  await options.config.loadPlugins(process.cwd(), 'app', plugins)
}

export default hook
