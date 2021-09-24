import { readState, writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import heroku from './herokuClient'
import type { HerokuApiResGetStaging } from 'heroku-client'
import getLatestReleaseDetails from './getLatestReleaseDetails'

export default async function getHerokuStagingApp(): Promise<string> {
  const ciState = readState('ci')
  const stagingState = readState('staging')

  if (!ciState || !ciState.version || !stagingState) {
    throw new ToolKitError(`could not find state information for ${ciState ? 'staging' : 'ci'}`)
  }
  const version = ciState.version
  const appId = stagingState.appIds[0]

  console.log(`retrieving `)
  const { name: appName }: HerokuApiResGetStaging = await heroku.get(`/apps/${appId}`)

  writeState('staging', { appName })
  console.log(`retrieving details for ${appName}'s latest release...`)
  const { slug, id, status } = await getLatestReleaseDetails(appName)

  console.log(`checking ${appName} is deployed with the latest commit...`)
  if (version !== slug.commit) {
    const error = new ToolKitError(`your staging does not have your latest commit`)
    error.details = `
    latest: ${version.slice(0, 7)}, currently deployed: ${slug.commit.slice(0, 7)}...
    if this is the first time you've seen this message, try re-running the pipeline... 
    otherwise check that you've set up automatic deployments for your staging app in heroku, and refer to the build logs of your staging app.`
    throw error
  }

  console.log(`deployed commit is latest (${version.slice(0, 7)})`)

  if (status === 'succeeded') {
    return appName
  } else {
    const error = new ToolKitError(`error getting staging app`)
    error.details = `there appears to be an error with the current release status - expected 'succeeded', received: ${status}. ${
      status === 'pending'
        ? `rerun the work flow as the release may still be building`
        : `refer to the build logs in the Heroku console.`
    } release details:
      app name: ${appName}
      app id: ${id}
      commit: ${slug.commit}
      status: ${status}
    `
    throw error
  }
}
