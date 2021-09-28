import { Task } from '@dotcom-tool-kit/task'
import getHerokuReviewApp from '../getHerokuReviewApp'
import gtg from '../gtg'
import setConfigVars from '../setConfigVars'
import { writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import herokuClient from '../herokuClient'
import type { HerokuApiResPipeline } from 'heroku-client'
import type { VaultPath } from '@dotcom-tool-kit/vault'

type HerokuReviewOptions = {
  pipeline?: string
  vaultPath?: VaultPath
}

export default class HerokuReview extends Task<HerokuReviewOptions> {
  static description = ''

  static defaultOptions: HerokuReviewOptions = {
    pipeline: undefined,
    vaultPath: undefined
  }

  async run(): Promise<void> {
    try {
      if (!this.options.pipeline) {
        const error = new ToolKitError('no pipeline option in your Tool Kit configuration')
        error.details = `the Heroku plugin needs to know your pipeline name to deploy Review Apps. add it to your configuration, e.g.:

options:
  '@dotcom-tool-kit/heroku':
    pipeline: your-heroku-pipeline`

        throw error
      }

      const pipeline: HerokuApiResPipeline = await herokuClient.get(`/pipelines/${this.options.pipeline}`)

      const reviewAppId = await getHerokuReviewApp(pipeline.id)

      writeState('review', { appId: reviewAppId })

      if (!this.options.vaultPath) {
        const error = new ToolKitError('No vaultPath option in your Tool Kit configuration')
        error.details = `the vaultPath is needed to get your app's secrets from vault, e.g.
        options:
          '@dotcom-tool-kit/heroku':
            vaultPath:
              team: "next"
              app: "your-app"
          `
        throw error
      }

      await setConfigVars(reviewAppId, 'continuous-integration', this.options.vaultPath)

      await gtg(reviewAppId, 'review')
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
