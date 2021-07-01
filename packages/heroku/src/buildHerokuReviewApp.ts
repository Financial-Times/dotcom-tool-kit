import heroku from './herokuClient'
import repeatedCheckForSuccessStatus from './repeatedCheckForSuccessStatus'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function buildHerokuReviewApp(pipelineId: string): Promise<string> {
  const state = readState('ci')

  if (!state) {
    throw new ToolKitError('Could not find CI state') //TODO - what to do in this situation?
  }

  const { branch, repo, version } = state

  const url = `https://github.com/Financial-Times/${repo}/archive/refs/heads/${branch}.zip`

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

  const successStatus = await repeatedCheckForSuccessStatus(reviewApp.id)

  if (successStatus) {
    return reviewApp.id
  } else {
    throw new ToolKitError(`Something went wrong with building the review-app`)
  }
}
