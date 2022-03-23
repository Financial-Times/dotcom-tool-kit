import { readState, writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import heroku from './herokuClient'
import type { HerokuApiResGetStaging } from 'heroku-client'

async function getHerokuStagingApp(): Promise<string> {
  const stagingState = readState('staging')

  if (!stagingState) {
    throw new ToolKitError('could not find state information for staging')
  }

  const appId = stagingState.appIds[0]
  
  try {
    const { name: appName }: HerokuApiResGetStaging = await heroku.get(`/apps/${appId}`)
    writeState('staging', { appName })
    return appName
  } catch (err) {
		const error = new ToolKitError('Unable to find latest app or write it to state')
		if (err instanceof Error) {
			error.details = err.message
		  } 
		throw error
  }
}
export { getHerokuStagingApp }
