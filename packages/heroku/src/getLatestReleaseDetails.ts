import heroku from './herokuClient'
import type { HerokuApiResGetRelease } from 'heroku-client'
import { writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function getLatestReleaseDetails(appName: string): Promise<HerokuApiResGetRelease> {
  console.log(`retrieving details for current ${appName} release...`)
  const releases: HerokuApiResGetRelease[] = await heroku.get(`/apps/${appName}/releases`)
  const latest = releases.find((release: { current: string }) => release.current)

  if (!latest) {
    throw new ToolKitError(
      'Could not find the current app details for staging, check that deploy:staging ran successfully'
    )
  }
  console.log(`current staging app found with id: ${latest.id}`)

  console.log(`current slug id found and writing to state file: ${latest.slug.id}`)
  writeState('staging', { slugId: latest.slug.id })

  return latest
}
