import pRetry from 'p-retry'
import heroku from './herokuClient'
import type { HerokuApiResGetReview } from 'heroku-client'
import type { Logger } from 'winston'

const NUM_RETRIES = process.env.HEROKU_REVIEW_APP_NUM_RETRIES
  ? parseInt(process.env.HEROKU_REVIEW_APP_NUM_RETRIES)
  : 60

async function repeatedCheckForSuccessStatus(logger: Logger, reviewAppId: string): Promise<void> {
  async function checkForSuccessStatus() {
    logger.debug(`review app id: ${reviewAppId}`)
    const reviewApp: HerokuApiResGetReview = await heroku.get(`/review-apps/${reviewAppId}`)
    logger.debug(`review app status: ${reviewApp.status}`)
    if (reviewApp.status === 'deleted') throw new pRetry.AbortError(`Review app was deleted`)
    if (reviewApp.status !== 'created') {
      throw new Error(`App build for app id: ${reviewAppId} not yet finished`)
    }
    return true
  }

  await pRetry(checkForSuccessStatus, {
    onFailedAttempt: (error) => {
      const { attemptNumber, retriesLeft } = error
      logger.warn(`attempt ${attemptNumber} failed. There are ${retriesLeft} retries left.`)
    },
    factor: 1,
    retries: NUM_RETRIES,
    minTimeout: 10 * 1000
  })
}

export { repeatedCheckForSuccessStatus }
