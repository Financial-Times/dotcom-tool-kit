import { Task } from '@dotcom-tool-kit/base'
import { getHerokuReviewApp } from '../getHerokuReviewApp.js'
import { buildHerokuReviewApp } from '../buildHerokuReviewApp.js'
import { gtg } from '../gtg.js'
import { setStageConfigVars } from '../setConfigVars.js'
import { writeState } from '@dotcom-tool-kit/state'
import { HerokuSchema } from '@dotcom-tool-kit/schemas/plugins/heroku.js'
import { ToolKitError } from '@dotcom-tool-kit/error'
import herokuClient, { extractHerokuError } from '../herokuClient.js'
import type { HerokuApiResPipeline } from 'heroku-client'

export default class HerokuReview extends Task<{ plugin: typeof HerokuSchema }> {
  async run(): Promise<void> {
    try {
      const pipeline = await herokuClient
        .get<HerokuApiResPipeline>(`/pipelines/${this.pluginOptions.pipeline}`)
        .catch(extractHerokuError(`getting pipeline ${this.pluginOptions.pipeline}`))
      await setStageConfigVars(this.logger, 'review', 'prod', pipeline.id)

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
