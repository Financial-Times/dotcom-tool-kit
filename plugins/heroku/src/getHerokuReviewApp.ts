import heroku from './herokuClient'
import type { HerokuApiResGetReview } from 'heroku-client'
import type { Logger } from 'winston'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { repeatedCheckForSuccessStatus } from './repeatedCheckForSuccessStatus'

async function getHerokuReviewApp(logger: Logger, pipelineId: string): Promise<string> {
  const state = readState('ci')

  if (!state) {
    throw new ToolKitError('could not find CI') //TODO - remidating actions?
  }

  const branch = state.branch
  const reviewApps: HerokuApiResGetReview[] = await heroku.get(`/pipelines/${pipelineId}/review-apps`)

  const reviewApp = reviewApps.find(
    (instance: { id: string; app: { id: string }; branch: string; status: string }): boolean => {
      return instance.branch === branch && (instance.status === 'created' || instance.status === 'creating')
    }
  )

  if (!reviewApp) {
    const error = new ToolKitError(`Unable to find a viable review app for ${branch} branch`)
    error.details = `if this is the first time you've received this message, try re-running the workflow. otherwise check that you have automatic deploys configured and working on your review-app in Heroku`
    throw error
  }

  if (reviewApp.status === 'creating') {
    logger.debug('here', reviewApp.status)
    await repeatedCheckForSuccessStatus(logger, reviewApp.id)
  }

  return reviewApp.app.id
}

export { getHerokuReviewApp }
