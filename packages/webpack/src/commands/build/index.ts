import BaseCommand from '@dotcom-tool-kit/base-command'

export default class Development extends BaseCommand {
   static description = 'build development'
   static args = []
   static flags = {}
   async run() {
      this.log('i am building development')
   }
}
