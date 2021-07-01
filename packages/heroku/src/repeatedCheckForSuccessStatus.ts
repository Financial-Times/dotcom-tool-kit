import pRetry from 'p-retry'
import heroku from './herokuClient'
import { HerokuApiResGetReview } from 'heroku-client'

const NUM_RETRIES = process.env.HEROKU_REVIEW_APP_NUM_RETRIES
  ? parseInt(process.env.HEROKU_REVIEW_APP_NUM_RETRIES)
  : 60

export default async function repeatedCheckForSuccessStatus(reviewAppId: string): Promise<boolean> {
  async function checkForSuccessStatus() {
    const reviewApp: HerokuApiResGetReview[0] = await heroku.get(`/review-apps/${reviewAppId}`)
    if (reviewApp.status === 'deleted') throw new pRetry.AbortError(`Review app was deleted`)
    if (reviewApp.status !== 'created')
      throw new Error(`App build for app id: ${reviewAppId} not yet finished`)

    return true
  }

  const result = await pRetry(checkForSuccessStatus, {
    onFailedAttempt: (error) => {
      const { attemptNumber, retriesLeft } = error
      console.log(`Attempt ${attemptNumber} failed. There are ${retriesLeft} retries left.`) // eslint-disable-line no-console
    },
    retries: NUM_RETRIES,
    minTimeout: 10 * 1000
  })

  return result
}
