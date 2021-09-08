import heroku from './herokuClient'
import repeatedCheckForSuccessStatus from './repeatedCheckForSuccessStatus'
import getRepoDetails from './githubApi'
import type { HerokuApiResGetReview } from 'heroku-client'

import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function buildHerokuReviewApp(pipelineId: string): Promise<string> {
  const { branch, repo, source_blob } = await getRepoDetails()

  console.log(`Creating review app for ${branch} branch on ${repo}...`)
  const reviewAppBuild = await heroku.post(`/review-apps`, {
    body: {
      branch: branch,
      pipeline: pipelineId,
      source_blob
    }
  })

  console.log('reviewApp in buildHerokuReviewApp', reviewAppBuild)

  console.log(`Checking review app for success status...`)

  const successStatus = await repeatedCheckForSuccessStatus(reviewAppBuild.id)

  const reviewApp: HerokuApiResGetReview = await heroku.get(`/review-apps/${reviewAppBuild.id}`)

  if (successStatus) {
    return reviewApp.app.id
  } else {
    const error = new ToolKitError(`The review-app did not reach success status within the time limit.`)
    error.details = `If this is the first time that you're seeing this error, please try again as it can be slower to build at peak times.
                    The review-app build request was attempted on repo: ${repo}, branch: ${branch}, version: ${source_blob.version}.`
    throw error
  }
}
