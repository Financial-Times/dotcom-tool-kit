import Heroku from 'heroku-client'
import repeatedCheckForSuccessStatus from './repeatedCheckForSuccessStatus'
import { readState } from '@dotcom-tool-kit/state'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN
const heroku = new Heroku({ token: HEROKU_API_TOKEN })

export default async function buildHerokuReviewApp(pipelineId: string): Promise<string> {
  const branch = readState('ci')?.branch
  const repo = readState('ci')?.repo
  const version = readState('ci')?.version

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
    console.error(`Something went wrong with building the review-app`) // eslint-disable-line no-console
    process.exit(1)
  }
}
