import { Command } from '@oclif/command'
import getHerokuReviewApp from '../getHerokuReviewApp'
import buildHerokuReviewApp from '../buildHerokuReviewApp'
import setConfigVars from '../setConfigVars'

const TARGET_BRANCH = process.env.TARGET_BRANCH! 
const HEROKU_PIPELINE_ID = process.env.HEROKU_PIPELINE_ID!
const REPONAME = '?'

export default class HerokuReview extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      console.log('Heroku Review') // eslint-disable-line no-console

      let reviewAppId = await getHerokuReviewApp(TARGET_BRANCH, HEROKU_PIPELINE_ID)

      if (!reviewAppId) {
         reviewAppId = await buildHerokuReviewApp(TARGET_BRANCH, HEROKU_PIPELINE_ID, REPONAME)
      } 
      await setConfigVars(reviewAppId, 'continuous-integration')
      // poll gtg until successful response

   }
}