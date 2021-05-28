import { Command } from '@oclif/command'
import getSlug from '../getSlug'
import setSlug from '../setSlug'
import gtg from '../gtg'

export default class HerokuProduction extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      try {
         //retrieve slug from staging
         const stagingSlugId = await getSlug('staging')
         // replace production slug - api version of 'promotion'
         console.log(`Promoting staging to production....`) // eslint-disable-line no-console
         const appId = await setSlug(stagingSlugId)
         
         await gtg(appId, 'production', true) 
         console.log(`Staging has been successfully promoted to production`) // eslint-disable-line no-console
         process.exit(0)
      } catch {
         console.log(`There was a problem promoting staging production`)// eslint-disable-line no-console
         process.exit(1)
      }
   }
}