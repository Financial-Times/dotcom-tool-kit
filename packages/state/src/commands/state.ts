import { Command } from '@oclif/command'

export default class State extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      console.log('state') // eslint-disable-line no-console
   }
}