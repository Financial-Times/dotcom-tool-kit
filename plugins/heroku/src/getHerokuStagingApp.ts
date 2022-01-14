import { readState, writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import heroku from './herokuClient'
import type { HerokuApiResGetStaging } from 'heroku-client'
import type { Logger } from 'winston'
import { writeLatestReleaseDetails } from './writeLatestReleaseDetails'

async function getHerokuStagingApp(logger: Logger): Promise<string> {
  const ciState = readState('ci')
  const stagingState = readState('staging')

  if (!ciState || !ciState.version || !stagingState) {
    throw new ToolKitError(`could not find state information for ${ciState ? 'staging' : 'ci'}`)
  }
  const version = ciState.version
  const appId = stagingState.appIds[0]

  const { name: appName }: HerokuApiResGetStaging = await heroku.get(`/apps/${appId}`)

  writeState('staging', { appName })
  logger.verbose(`retrieving details for ${appName}'s latest release...`)

  try {
    await writeLatestReleaseDetails(logger, appName, version)
  } catch {
    throw new ToolKitError(
      `Error finding release details for ${appName}, please refer to the app's build logs to check that it has built correctly`
    )
  }
  return appName
}

export { getHerokuStagingApp }
