import BaseCommand from '@dotcom-tool-kit/base-command'

export default class Production extends BaseCommand {
   static description = 'build production'
   static args = []
   static flags = {}
   async run() {
      this.log('i am building production')
   }
}
