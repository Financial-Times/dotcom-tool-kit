import { runCommand } from '../'
import { isConflict } from '../conflict'
import { config } from '../config'
import type { Command } from '../command'

export default class InstallCommand implements Command {
   static description = 'run lifecycle commands'

   async run() {
      for(const [id, Lifecycle] of Object.entries(config.lifecycles)) {
         if(isConflict(Lifecycle)) continue

         const lifecycle = new Lifecycle()

         if(!await lifecycle.verify()) {
            await lifecycle.install()
         }
      }
   }
}
