import { Task } from '@dotcom-tool-kit/base'
import { getHerokuReviewApp } from '../getHerokuReviewApp'
import { buildHerokuReviewApp } from '../buildHerokuReviewApp'
import { gtg } from '../gtg'
import { setStageConfigVars } from '../setConfigVars'
import { writeState } from '@dotcom-tool-kit/state'
import { HerokuSchema } from '@dotcom-tool-kit/schemas/lib/plugins/heroku'
import { ToolKitError } from '@dotcom-tool-kit/error'
import herokuClient, { extractHerokuError } from '../herokuClient'
import type { HerokuApiResPipeline } from 'heroku-client'

export default class HerokuReview extends Task<typeof HerokuSchema> {
  static description = ''

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
