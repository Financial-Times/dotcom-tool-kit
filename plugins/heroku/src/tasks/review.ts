import { Task } from '@dotcom-tool-kit/base'
import { getHerokuReviewApp } from '../getHerokuReviewApp'
import { buildHerokuReviewApp } from '../buildHerokuReviewApp'
import { gtg } from '../gtg'
import { writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import herokuClient, { extractHerokuError } from '../herokuClient'
import type HerokuSchema from '../schema'
import type { HerokuApiResPipeline } from 'heroku-client'

export default class HerokuReview extends Task<{ plugin: typeof HerokuSchema }> {
  static description = 'Create and deploy a Heroku review app.'

  async run(): Promise<void> {
    try {
      const pipeline = await herokuClient
        .get<HerokuApiResPipeline>(`/pipelines/${this.pluginOptions.pipeline}`)
        .catch(extractHerokuError(`getting pipeline ${this.pluginOptions.pipeline}`))

      let reviewAppId = await getHerokuReviewApp(this.logger, pipeline.id)

      if (!reviewAppId) {
        reviewAppId = await buildHerokuReviewApp(this.logger, pipeline.id)
      }
      writeState('review', {
        appId: reviewAppId
      })
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
