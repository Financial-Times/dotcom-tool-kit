import { Command } from '@dotcom-tool-kit/command'
import getHerokuReviewApp from '../getHerokuReviewApp'
import buildHerokuReviewApp from '../buildHerokuReviewApp'
import setConfigVars from '../setConfigVars'
import gtg from '../gtg'
import { writeState } from '@dotcom-tool-kit/state'

const HEROKU_PIPELINE_ID = process.env.HEROKU_PIPELINE_ID || ''

export default class HerokuReview extends Command {
  static description = ''
  static flags = {}
  static args = []

  async run(): Promise<void> {
    try {
      let reviewAppId = await getHerokuReviewApp(HEROKU_PIPELINE_ID)

      if (!reviewAppId) {
        reviewAppId = await buildHerokuReviewApp(HEROKU_PIPELINE_ID)
      }

      writeState('review', { appId: reviewAppId })

      await setConfigVars(reviewAppId, 'continuous-integration')

      await gtg(reviewAppId, 'review')

      process.exit(0)
    } catch (err) {
      console.error('Error building review-app:', err) // eslint-disable-line no-console
      process.exit(1)
    }
  }
}
