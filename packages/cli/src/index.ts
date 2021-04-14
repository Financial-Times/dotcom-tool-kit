import { validateConfig, config, ValidConfig } from './config'
import { loadPluginConfig } from './plugin'

export async function load(): Promise<ValidConfig> {
   // start loading config and child plugins, starting from the consumer app directory
   await loadPluginConfig({
      id: 'app root',
      root: process.cwd(),
   })

   validateConfig(config)
   return config
}

export async function runCommand(id: string, argv: string[]) {
   validateConfig(config)

   if(!(id in config.commands)) {
      // TODO improve error message
      throw new Error(`command "${id}" not found`)
   }

   const Command = config.commands[id]
   const command = new Command(argv)

   // dummy oclif config so @oclif/command's init doesn't crash
   command.config = {}

   if(command.init != null) {
      await command.init()
   }

   return command.run()
}
