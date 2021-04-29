import { Command } from '@oclif/command'

export default class HerokuStaging extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      console.log('Heroku Staging') // eslint-disable-line no-console
   }
}