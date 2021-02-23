import {Hook, Plugin, IConfig} from '@oclif/config'
import * as readPkgUp from 'read-pkg-up'

// according to Oclif's type definitions, loadPlugins isn't there on
// options.config. but we know it is. so tell Typescript it can use
// it by using a type predicate function to make it into this interface
interface PluginLoader {
   loadPlugins(root: string, type: string, plugins: string[]): Promise<void>
}

function canLoadPlugins(config: any): config is PluginLoader {
   if(typeof config.loadPlugins === 'function') {
      return true
   }

   return false
}

const hook: Hook<'init'> = async function (options) {
   const result = await readPkgUp()
   if (!result) return

   const { devDependencies = {} } = result.packageJson
   const plugins = Object.keys(devDependencies).filter(
      dep => dep.startsWith('@dotcom-tool-kit')
   )

   if (canLoadPlugins(options.config)) {
      await options.config.loadPlugins(process.cwd(), 'consumer', plugins)
   }
}

export default hook
