import pRetry from 'p-retry'
import heroku from './herokuClient'
import type { HerokuApiResBuild } from 'heroku-client'
import type { Logger } from 'winston'

const NUM_RETRIES = process.env.HEROKU_BUILD_NUM_RETRIES
  ? parseInt(process.env.HEROKU_BUILD_NUM_RETRIES)
  : 10

async function repeatedCheckForBuildSuccess(logger: Logger, appName: string, buildId: string): Promise<string> {
  async function checkForSuccessStatus() {
    const buildInfo: HerokuApiResBuild = await heroku.get(`/apps/${appName}/builds/${buildId}`)
    logger.debug(`build status: ${buildInfo.status}`)
    if (buildInfo.status !== 'succeeded' || buildInfo.slug === null)
      throw new Error(`Build for app ${appName} not yet finished`)
    return buildInfo.slug.id
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

export { repeatedCheckForBuildSuccess }