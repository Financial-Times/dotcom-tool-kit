import { validateConfig, config, ValidConfig } from './config'
import { loadPluginConfig } from './plugin'

export async function load(): Promise<ValidConfig> {
  // start loading config and child plugins, starting from the consumer app directory
  await loadPluginConfig({
    id: 'app root',
    root: process.cwd()
  })

   return validateConfig(config)
}

export async function runCommand(id: string, argv: string[]): Promise<void> {
   const validConfig = await validateConfig(config)

   if (!(id in validConfig.commands)) {
    // TODO improve error message
    throw new Error(`command "${id}" not found`)
  }

   const Command = validConfig.commands[id]
  const command = new Command(argv)

   // attach any options from validConfig files to the command instance
   if (Command.plugin && validConfig.options[Command.plugin.id]) {
      command.options = validConfig.options[Command.plugin.id].options
  }

  return command.run()
}
