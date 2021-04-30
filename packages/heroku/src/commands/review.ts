import { Command } from '@oclif/command'
import getHerokuReviewApp from '../getHerokuReviewApp'
import buildHerokuReviewApp from '../buildHerokuReviewApp'
import getRepoDetails from '../getRepoDetails'

const TARGET_BRANCH = process.env.TARGET_BRANCH! 
const HEROKU_PIPELINE_ID = process.env.HEROKU_PIPELINE_ID!

export default class HerokuReview extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      console.log('Heroku Review') // eslint-disable-line no-console

      let reviewAppId = await getHerokuReviewApp(TARGET_BRANCH, HEROKU_PIPELINE_ID)

      if (!reviewAppId) {
         //need to configure github api call
         const { url, repoVersion } = await getRepoDetails() 
         reviewAppId = await buildHerokuReviewApp(TARGET_BRANCH, HEROKU_PIPELINE_ID, "repo-name", "repo version")
      } 
      // set config vars
      // poll gtg until successful response

   }
}