import { readState, writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import heroku, { extractHerokuError } from './herokuClient'
import type { HerokuApiResGetStaging } from 'heroku-client'

async function getHerokuStagingApp(): Promise<string> {
  const stagingState = readState('staging')

  if (!stagingState) {
    throw new ToolKitError('could not find state information for staging')
  }

  const appId = stagingState.appIds[0]
  const { name: appName } = await heroku
    .get<HerokuApiResGetStaging>(`/apps/${appId}`)
    .catch(extractHerokuError(`getting name for app ${appId}`))
  writeState('staging', {
    appName
  })
  return appName
}
export { getHerokuStagingApp }
