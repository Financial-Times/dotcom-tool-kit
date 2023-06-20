import { ToolKitError } from '@dotcom-tool-kit/error'
import pRetry from 'p-retry'
import heroku, { extractHerokuError } from './herokuClient'
import type { HerokuApiResGetRelease } from 'heroku-client'
import type { Logger } from 'winston'

const NUM_RETRIES = process.env.HEROKU_STAGING_NUM_RETRIES
  ? parseInt(process.env.HEROKU_STAGING_NUM_RETRIES, 10)
  : 60

export default async function checkIfStagingUpdated(
  logger: Logger,
  appName: string,
  releaseId: string
): Promise<boolean> {
  async function checkForSuccessStatus() {
    logger.verbose(`existing staging app release id: ${releaseId}`)
    const existingStagingRelease = await heroku
      .get<HerokuApiResGetRelease>(`/apps/${appName}/releases/${releaseId}`)
      .catch(extractHerokuError(`checking status of release ${releaseId} of app ${appName}`))
    logger.verbose(`existing staging app status: ${existingStagingRelease.current}`)
    if (existingStagingRelease.current) {
      throw new ToolKitError(`Staging app not yet updated - current is still release id: ${releaseId}`)
    }

    return true
  }

  const result = await pRetry(checkForSuccessStatus, {
    onFailedAttempt: (error) => {
      const { attemptNumber, retriesLeft } = error
      logger.warn(`attempt ${attemptNumber} failed. There are ${retriesLeft} retries left.`)
    },
    factor: 1,
    retries: NUM_RETRIES,
    minTimeout: 10 * 1000
  })

  return result
}
