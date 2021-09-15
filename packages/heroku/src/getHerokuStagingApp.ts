import { readState, writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import getLatestReleaseDetails from './getLatestReleaseDetails'

export default async function getHerokuStagingApp(): Promise<string> {
  const state = readState('ci')

  if (!state) {
    throw new ToolKitError('could not find CI state')
  }
  const { repo, version } = state
  const appName = `ft-${repo}-staging`

  writeState('staging', { appName })
  console.log(`retreiving details for ${appName}'s latest release...`)
  const { slug, id } = await getLatestReleaseDetails(appName)

  console.log(`checking ${appName} is deployed with the latest commit...`)
  if (version !== slug.commit) {
    const error = new ToolKitError(`your staging does not have your latest commit`)
    error.message = `
    latest: ${version.slice(0, 7)}, currently deployed: ${slug.commit.slice(0, 7)}...
    if this is the first time you've seen this message, try re-running the pipeline... 
    otherwise check that you've set up automatic deployments for your staging app in heroku, and refer to the build logs of your staging app.`
    throw error
  }

  console.log(`deployed commit is latest (${version.slice(0, 7)})`)

  if (slug.status === 'succeeded') {
    return appName
  } else {
    const error = new ToolKitError(`Error getting staging app`)
    error.message = `
      app name: ${appName}
      app id: ${id}
      commit: ${slug.commit}
      status: ${slug.status}
    `
    throw error
  }
}
