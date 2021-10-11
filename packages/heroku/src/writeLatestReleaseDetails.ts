import heroku from './herokuClient'
import type { HerokuApiResGetRelease, HerokuApiGetSlug } from 'heroku-client'
import { writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'
import checkIfStagingUpdated from './checkIfStagingUpdated'

type ReleaseDetails = {
  slug: {
    id: string
  }
  commit: string
  id: string
  status: string
}

async function findLatestRelease(appName: string): Promise<ReleaseDetails> {
  console.log(`retrieving details for current ${appName} release...`)
  const releases: HerokuApiResGetRelease[] = await heroku.get(`/apps/${appName}/releases`)
  const latestFound = releases.find((release: { current: boolean }) => release.current)

  if (!latestFound) {
    throw new ToolKitError(
      'Could not find the current app details for staging, check that deploy:staging ran successfully'
    )
  }
  console.log(`current staging app found with id: ${latestFound.id}`)

  const { commit }: HerokuApiGetSlug = await heroku.get(`/apps/${appName}/slugs/${latestFound.slug.id}`)
  const { slug, id, status } = latestFound
  return { commit, slug, id, status }
}

let latest: ReleaseDetails

async function compare(appName: string, version: string, attempt = 1): Promise<boolean> {
  if (attempt > 3) {
    throw new ToolKitError(
      `There was a problem with updating your staging app, please check that it's updated to the correct version`
    )
  }
  if (latest?.commit === version) {
    return true
  } else {
    if (latest?.id) {
      await checkIfStagingUpdated(appName, latest.id)
    }
    latest = await findLatestRelease(appName)
    return compare(appName, version, attempt + 1)
  }
}

async function writeLatestReleaseDetails(appName: string, version: string): Promise<void> {
  try {
    console.log(`checking ${appName} is deployed with the latest commit...`)
    await compare(appName, version)
  } catch {
    const error = new ToolKitError(`your staging does not have your latest commit`)
    error.details = `
      latest: ${version.slice(0, 7)}, currently deployed: ${latest.commit.slice(0, 7)}...
      if this is the first time you've seen this message, try re-running the pipeline... 
      otherwise check that you've set up automatic deployments for your staging app in heroku, and refer to the build logs of your staging app.`
    throw error
  }

  if (latest.status === 'succeeded') {
    console.log(`current slug id found and writing to state file: ${latest.slug.id}`)
    writeState('staging', { slugId: latest.slug.id })
    return
  } else {
    const error = new ToolKitError(`error getting staging app`)
    error.details = `there appears to be an error with the current release status - expected 'succeeded', received: ${
      latest.status
    }. ${
      latest.status === 'pending'
        ? `rerun the work flow as the release may still be building`
        : `refer to the build logs in the Heroku console.`
    } release details:
      app name: ${appName}
      app id: ${latest.id}
      commit: ${latest.commit}
      status: ${latest.status}
    `
    throw error
  }
}

export { writeLatestReleaseDetails }
