import { isConflict } from '../conflict'
import { config } from '../config'
import type { Command } from '../command'

export default class HelpCommand implements Command {
   static description = 'show this help'

   constructor(public argv: string[]) {}

   showHelp() {
      for(const [id, command] of Object.entries(config.commands)) {
         if(isConflict(command) || command.hidden) continue

         console.log(`${id}\t${command.description}`)
      }
   }

   showCommandHelp(id: string) {
      const command = config.commands[id]
      if(isConflict(command)) return

      // TODO print argument help somehow?
      console.log(`${id}\t${command.description}`)
   }

   async run() {
      const [id] = this.argv

      if(id) {
         this.showCommandHelp(id)
      } else {
         this.showHelp()
      }
   }
}
