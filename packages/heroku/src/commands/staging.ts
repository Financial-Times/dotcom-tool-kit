import { Command } from '@oclif/command'
import scaleUpDyno from '../scaleUpDyno'

export default class HerokuStaging extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      //scale up staging
      await scaleUpDyno(true)
   }
}

// make deploy-staging in n-gage
 
//deploy on rebuilds even when no change?
//waits for it to start running?
//configures with vars from vault
//gtg
//smoke tests?
