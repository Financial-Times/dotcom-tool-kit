import {Hook, load} from '@oclif/config'

const hook: Hook<'init'> = async function(options) {
   console.log(options.config.loadPlugins)
}

export default hook
