import {Command} from '@oclif/command'

export default class Production extends Command {
   static description = 'build production'
   static args = []
   static flags = {}
   async run() {
      this.log('i am building babel production')
   }
}
