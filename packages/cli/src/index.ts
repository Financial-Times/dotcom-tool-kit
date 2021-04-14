import { validateConfig, config, ValidConfig } from './config'
import { loadPluginsFromConfig } from './plugin'

const appRoot = process.cwd()

export async function load(): Promise<ValidConfig> {
   await loadPluginsFromConfig(appRoot)
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
