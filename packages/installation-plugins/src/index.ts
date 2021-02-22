import {Hook, Config, Plugin, IConfig} from '@oclif/config'
import * as readPkgUp from 'read-pkg-up'

const hook: Hook<'init'> = async function(options) {
   const result = await readPkgUp()
   if(!result) return

   const { devDependencies = {} } = result.packageJson
   const plugins = Object.keys(devDependencies).filter(
      dep => dep.startsWith('@dotcom-tool-kit')
   )

   await Promise.all(
      plugins.map(
         async plugin => {
            const instance = new Plugin({
               name: plugin,
               type: 'consumer',
               root: process.cwd(),
            })

            await instance.load()
            options.config.plugins.push(instance)
         }
      )
   )
}

export default hook
