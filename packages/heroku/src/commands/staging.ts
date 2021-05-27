import { Command } from '@oclif/command'
import { readState } from '@dotcom-tool-kit/state'
import setConfigVars from '../setConfigVars'
import scaleUpDyno from '../scaleUpDyno'
import gtg from '../gtg'

export default class HerokuStaging extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      //get app name
      const { repo } = readState('ci', ['repo'])
      const appName = `ft-${repo}-staging`     
      //apply vars from vault
      await setConfigVars(appName, 'production')
      //scale up staging
      await scaleUpDyno(appName)

      await gtg(appName, 'staging', false).then(process.exit(0))
   }
}

// make deploy-staging in n-gage
 
//deploy on rebuilds even when no change?
//waits for it to start running?
//configures with vars from vault
//gtg
//smoke tests?
