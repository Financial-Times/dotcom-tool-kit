import type { HerokuApiResGetReview, HerokuApiResPost } from 'heroku-client'
import { type Logger } from 'winston'

import { ToolKitError } from '@dotcom-tool-kit/error'

import heroku, { extractHerokuError } from './herokuClient'
import { repeatedCheckForSuccessStatus } from './repeatedCheckForSuccessStatus'
import { getRepoDetails } from './githubApi'

async function buildHerokuReviewApp(logger: Logger, pipelineId: string): Promise<string> {
  const { branch, repo, source_blob } = await getRepoDetails(logger)

  logger.info(`creating review app for ${branch} branch on ${repo}...`)
  const reviewAppBuild = await heroku
    .post<HerokuApiResPost>(`/review-apps`, {
      body: {
        branch: branch,
        pipeline: pipelineId,
        source_blob
      }
    })
    .catch(extractHerokuError(`creating review app on pipeline ${pipelineId}`))

  logger.info('reviewApp in buildHerokuReviewApp', reviewAppBuild)

  logger.info(`checking review app for success status...`)

  try {
    await repeatedCheckForSuccessStatus(logger, reviewAppBuild.id)
  } catch (err) {
    const error = new ToolKitError(`the review-app did not reach success status within the time limit.`)
    error.details = `If this is the first time that you're seeing this error, please try again as it can be slower to build at peak times.
                    The review-app build request was attempted on repo: ${repo}, branch: ${branch}, version: ${source_blob.version}.`
    throw error
  }

  const reviewApp: HerokuApiResGetReview = await heroku
    .get<HerokuApiResGetReview>(`/review-apps/${reviewAppBuild.id}`)
    .catch(extractHerokuError(`getting app ID for review app ${reviewAppBuild.id}`))

  return reviewApp.app.id
}

export { buildHerokuReviewApp }
