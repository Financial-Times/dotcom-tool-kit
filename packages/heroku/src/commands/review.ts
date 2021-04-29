import { Command } from '@oclif/command'
import getHerokuReviewApp from '../getHerokuReviewApp'


export default class HerokuReview extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      console.log('Heroku Review') // eslint-disable-line no-console

      // get auth token
      // check for existing review app, get ID - 
         // By App name:GET /apps/{app_id_or_name}/review-app > 200 response.id or 404 response.id: "not_found"
         // By pipeline ID: GET /pipelines/{pipeline_id}/review-apps > response.filter(reviewApp => reviewApp.branch === branch) Status: reviewApp.status === 'created' 'creating' 'pending')
      // if none exists, create review app
      // set config vars
      // poll gtg until successful response
      // ---
      // run smoke test
      // run Pa11y

   }
}