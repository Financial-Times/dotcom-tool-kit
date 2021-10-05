import { Task } from '@dotcom-tool-kit/task'
import getHerokuReviewApp from '../getHerokuReviewApp'
import gtg from '../gtg'
import setConfigVars from '../setConfigVars'
import { writeState } from '@dotcom-tool-kit/state'
import { HerokuOptions, HerokuSchema } from '@dotcom-tool-kit/types/lib/schema/heroku'
import { ToolKitError } from '@dotcom-tool-kit/error'
import herokuClient from '../herokuClient'
import type { HerokuApiResPipeline } from 'heroku-client'

export default class HerokuReview extends Task<typeof HerokuSchema> {
  static description = ''

  static defaultOptions: HerokuOptions = {
    pipeline: undefined,
    vaultTeam: undefined,
    vaultApp: undefined
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

      if (!this.options.vaultTeam || !this.options.vaultApp) {
        const error = new ToolKitError('Vault options not found in your Tool Kit configuration')
        error.details = `vaultTeam and vaultApp are needed to get your app's secrets from vault, e.g.
        options:
          '@dotcom-tool-kit/heroku':
            vaultTeam: "next"
            vaultApp: "your-app"
          `
        throw error
      }

      await setConfigVars(reviewAppId, 'continuous-integration', {
        team: this.options.vaultTeam,
        app: this.options.vaultApp
      })

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
