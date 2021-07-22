import heroku from './herokuClient'
import repeatedCheckForSuccessStatus from './repeatedCheckForSuccessStatus'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function buildHerokuReviewApp(pipelineId: string): Promise<string> {
  const state = readState('ci')

  if (!state) {
    throw new ToolKitError('Could not find CI state')
  }

  const { branch, repo, version } = state

  const url = `https://github.com/Financial-Times/${repo}/archive/refs/heads/${branch}.zip`

  console.log(`Creating review app for ${branch} branch on ${repo}...`)
  const reviewApp = await heroku.post(`/review-apps`, {
    body: {
      branch: branch,
      pipeline: pipelineId,
      source_blob: {
        url: url,
        version: version
      }
    }
  })

  console.log(`Checking review app for success status...`)
  const successStatus = await repeatedCheckForSuccessStatus(reviewApp.id)

  if (successStatus) {
    return reviewApp.id
  } else {
    const error = new ToolKitError(`The review-app did not reach success status within the time limit.`)
    error.details = `If this is the first time that you're seeing this error, please try again as it can be slower to build at peak times.
                    The review-app build request was attempted on repo: ${repo}, branch: ${branch}, version: ${version}.`
    throw error
  }
}
