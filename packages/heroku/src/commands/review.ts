import { Command } from '@dotcom-tool-kit/command'
import getHerokuReviewApp from '../getHerokuReviewApp'
import buildHerokuReviewApp from '../buildHerokuReviewApp'
import setConfigVars from '../setConfigVars'
import gtg from '../gtg'
import { writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

const HEROKU_PIPELINE_ID = process.env.HEROKU_PIPELINE_ID || ''

export default class HerokuReview extends Command {
  static description = ''

  async run(): Promise<void> {
    try {
      let reviewAppId = await getHerokuReviewApp(HEROKU_PIPELINE_ID)

      if (!reviewAppId) {
        reviewAppId = await buildHerokuReviewApp(HEROKU_PIPELINE_ID)
      }

      writeState('review', { appId: reviewAppId })

      await setConfigVars(reviewAppId, 'continuous-integration')

      await gtg(reviewAppId, 'review')
    } catch (err) {
      if (err instanceof ToolKitError) {
        throw err
      }

      const error = new ToolKitError(`Error building review-app`)
      error.details = err.message
      throw error
    }
  }
}
