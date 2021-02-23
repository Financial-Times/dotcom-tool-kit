import {Hook, Plugin, IConfig, PJSON} from '@oclif/config'
import * as readPkgUp from 'read-pkg-up'

// according to Oclif's type definitions, loadPlugins isn't there on
// options.config. but we know it is. so tell Typescript it can use
// it by using a type predicate function to make it into this interface
interface PluginLoader {
   loadPlugins(root: string, type: string, plugins: string[]): Promise<void>
}

interface InstallationPJSON extends PJSON.Plugin {
   oclif: PJSON.Plugin['oclif'] & {
      'installation-plugins': {
         prefix: string
      }
   }
}

function canLoadPlugins(config: any): config is PluginLoader {
   return typeof config.loadPlugins === 'function'
}

function isInstallationPJSON(pjson: PJSON.Plugin): pjson is InstallationPJSON {
   return 'installation-plugins' in pjson.oclif
}

const hook: Hook<'init'> = async function (options) {
   if (!canLoadPlugins(options.config)) return

   const result = await readPkgUp()
   if (!result) return

   const {pjson} = options.config
   if (!isInstallationPJSON(pjson)) {
      throw new Error(`${pjson.name} doesn't have an oclif.installation-plugins.prefix property. this is required to load plugins with this plugin`)
   }

   const { devDependencies = {} } = result.packageJson
   const plugins = Object.keys(devDependencies).filter(
      dep => dep.startsWith(pjson.oclif['installation-plugins'].prefix)
   )

   await options.config.loadPlugins(process.cwd(), 'consumer', plugins)
}

export default hook
