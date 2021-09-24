import heroku from './herokuClient'
import type { HerokuApiResGetRelease, HerokuApiGetSlug } from 'heroku-client'
import { writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

type ReleaseDetails = {
  slug: {
    commit: string
  }
  id: string
  status: string
}

export default async function getLatestReleaseDetails(appName: string): Promise<ReleaseDetails> {
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

  const slug: HerokuApiGetSlug = await heroku.get(`/apps/${appName}/slugs/${latest.slug.id}`)

  const { id, status } = latest

  return { slug, id, status }
}
