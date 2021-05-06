import { Command } from '@oclif/command'
import getHerokuReviewApp from '../getHerokuReviewApp'
import buildHerokuReviewApp from '../buildHerokuReviewApp'
import setConfigVars from '../setConfigVars'
import gtg from '../gtg'

const HEROKU_PIPELINE_ID = process.env.HEROKU_PIPELINE_ID!

export default class HerokuReview extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
  
      let reviewAppId = await getHerokuReviewApp(HEROKU_PIPELINE_ID)

      if (!reviewAppId) {
         reviewAppId = await buildHerokuReviewApp(HEROKU_PIPELINE_ID)
      } 
      await setConfigVars(reviewAppId, 'continuous-integration')

      await gtg(reviewAppId)
   }
}