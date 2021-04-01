import { IConfig } from '@oclif/config'

type LifecycleCommand<T> = {
   lifecycles: T[]
}

function hasLifecycles<T>(command: any): command is LifecycleCommand<T> {
   return 'lifecycles' in command
}

export function runLifecycle<T extends string>(lifecycle: T, argv: string[], config: IConfig) {
   const lifecycleCommands = config.commands.filter(commandPlugin => {
      const command = commandPlugin.load()

      if(!hasLifecycles<T>(command)) return

      return command.lifecycles.includes(lifecycle)
   })

   if(lifecycleCommands.length > 1) {
      const pluginNames = lifecycleCommands.map(command => command.pluginName).join(', ')

      throw new Error(`multiple plugins are installed that handle the lifecycle event ${lifecycle}. please remove all but one of these plugins: ${pluginNames}`)
   }

   if(lifecycleCommands.length === 1) {
      return lifecycleCommands[0].load().run(argv, config)
   }
}
