import { Command } from '@dotcom-tool-kit/command'
import getHerokuReviewApp from '../getHerokuReviewApp'
import buildHerokuReviewApp from '../buildHerokuReviewApp'
import setConfigVars from '../setConfigVars'
import gtg from '../gtg'
import { writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

type HerokuReviewOptions = {
  pipeline?: string
}

export default class HerokuReview extends Command {
  static description = ''

  options: HerokuReviewOptions = {
    pipeline: undefined
  }

  async run(): Promise<void> {
    try {
      if (!this.options.pipeline) {
        const error = new ToolKitError('no pipeline option in your Tool Kit configuration')
        error.details = `the Heroku plugin needs to know where your pipeline is to deploy Review Apps. add it to your configuration, e.g.:

options:
  '@dotcom-tool-kit/heroku':
    pipeline: your-heroku-pipeline`

        throw error
      }

      let reviewAppId = await getHerokuReviewApp(this.options.pipeline)

      if (!reviewAppId) {
        reviewAppId = await buildHerokuReviewApp(this.options.pipeline)
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
