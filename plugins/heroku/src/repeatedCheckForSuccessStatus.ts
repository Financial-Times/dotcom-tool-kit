import pRetry from 'p-retry'
import type { HerokuApiResGetReview } from 'heroku-client'
import type { Logger } from 'winston'

import heroku, { extractHerokuError } from './herokuClient'

const NUM_RETRIES = process.env.HEROKU_REVIEW_APP_NUM_RETRIES
  ? parseInt(process.env.HEROKU_REVIEW_APP_NUM_RETRIES, 10)
  : 60

async function repeatedCheckForSuccessStatus(logger: Logger, reviewAppId: string): Promise<void> {
  async function checkForSuccessStatus() {
    logger.debug(`review app id: ${reviewAppId}`)
    const reviewApp = await heroku
      .get<HerokuApiResGetReview>(`/review-apps/${reviewAppId}`)
      .catch(extractHerokuError(`getting review app ${reviewAppId}`))
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
