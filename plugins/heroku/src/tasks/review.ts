import { styles } from '@dotcom-tool-kit/logger'
import { Task } from '@dotcom-tool-kit/types'
import { getHerokuReviewApp } from '../getHerokuReviewApp'
import { gtg } from '../gtg'
import { setConfigVars } from '../setConfigVars'
import { writeState } from '@dotcom-tool-kit/state'
import { HerokuSchema } from '@dotcom-tool-kit/types/lib/schema/heroku'
import { ToolKitError } from '@dotcom-tool-kit/error'
import herokuClient from '../herokuClient'
import type { HerokuApiResPipeline } from 'heroku-client'

export default class HerokuReview extends Task<typeof HerokuSchema> {
  static description = ''

  async run(): Promise<void> {
    try {
      if (!this.options.pipeline) {
        const error = new ToolKitError('no pipeline option in your Tool Kit configuration')
        error.details = `the ${styles.plugin(
          'Heroku'
        )} plugin needs to know your pipeline name to deploy Review Apps. add it to your configuration, e.g.:

options:
  '@dotcom-tool-kit/heroku':
    pipeline: your-heroku-pipeline`

        throw error
      }

      const pipeline: HerokuApiResPipeline = await herokuClient.get(`/pipelines/${this.options.pipeline}`)

      const reviewAppId = await getHerokuReviewApp(this.logger, pipeline.id)

      writeState('review', { appId: reviewAppId })

      await setConfigVars(this.logger, reviewAppId, 'continuous-integration')

      await gtg(this.logger, reviewAppId, 'review')
    } catch (err) {
      if (err instanceof ToolKitError) {
        throw err
      }

      const error = new ToolKitError(`Error building review-app`)
      if (err instanceof Error) {
        error.details = err.message
      }
      throw error
    }
  }
}
