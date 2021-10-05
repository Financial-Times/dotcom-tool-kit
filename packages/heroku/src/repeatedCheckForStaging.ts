import pRetry from 'p-retry'
import heroku from './herokuClient'
import type { HerokuApiResGetRelease } from 'heroku-client'

const NUM_RETRIES = process.env.HEROKU_STAGING_NUM_RETRIES
  ? parseInt(process.env.HEROKU_STAGING_NUM_RETRIES)
  : 60

export default async function repeatedCheckForStaging(releaseId: string): Promise<boolean> {
  async function checkForSuccessStatus() {
    console.log(`existing staging app release id: ${releaseId}`)
    const existingStagingRelease: HerokuApiResGetRelease = await heroku.get(
      `/apps/appId/releases/${releaseId}`
    )
    console.log(`existing staging app status: ${existingStagingRelease.current}`)
    if (existingStagingRelease.current)
      throw new Error(`Staging app not yet updated - current is still release id: ${releaseId}`)

    return true
  }

  const result = await pRetry(checkForSuccessStatus, {
    onFailedAttempt: (error) => {
      const { attemptNumber, retriesLeft } = error
      console.log(`attempt ${attemptNumber} failed. There are ${retriesLeft} retries left.`) // eslint-disable-line no-console
    },
    factor: 1,
    retries: NUM_RETRIES,
    minTimeout: 10 * 1000
  })

  return result
}
