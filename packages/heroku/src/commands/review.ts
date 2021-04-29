import { Command } from '@oclif/command'

export default class HerokuReview extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      console.log('Heroku Review')
   }
}