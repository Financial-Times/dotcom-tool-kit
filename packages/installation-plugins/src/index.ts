import {Hook, Config} from '@oclif/config'

const hook: Hook<'init'> = async function(options) {
   const config = new Config(options)
   Object.assign(config, options.config)
   console.log(config.loadPlugins)
}

export default hook
