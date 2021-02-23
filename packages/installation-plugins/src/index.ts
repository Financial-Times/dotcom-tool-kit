import {Hook, Plugin, IConfig} from '@oclif/config'
import * as readPkgUp from 'read-pkg-up'

async function loadPlugin(config: IConfig, plugin: string, root: string) {
   const instance = new Plugin({
      name: plugin,
      type: 'consumer',
      root: process.cwd(),
   })

   await instance.load()
   config.plugins.push(instance)
}

async function loadPlugins(config: IConfig, plugins: string[], root: string) {
   await Promise.all(
      plugins.map(
         async plugin => {
            loadPlugin(config, plugin, root)
         }
      )
   )
}

const hook: Hook<'init'> = async function(options) {
   const result = await readPkgUp()
   if(!result) return

   const { devDependencies = {} } = result.packageJson
   const plugins = Object.keys(devDependencies).filter(
      dep => dep.startsWith('@dotcom-tool-kit')
   )

   await loadPlugins(options.config, plugins, process.cwd())
}

export default hook
