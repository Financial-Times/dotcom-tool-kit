import { Command } from '@oclif/command'

export default class HerokuProduction extends Command {
   static description = ''
   static flags = {}
   static args = []

   async run() {
      // get the slug id from staging-app

      // replace production slug
   }
}

//promote staging app to production



curl -X POST -H "Accept: application/vnd.heroku+json; version=3" -n \
-H "Content-Type: application/json" \
-d '{"slug": "ff40c84f-a538-4b65-a838-88fdd5245f4b"}' \
//https://api.heroku.com/apps/example-app-production/releases

POST /apps/{app_id_or_name}/releases