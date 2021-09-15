import heroku from './herokuClient'
import type { HerokuApiResGetSlug } from 'heroku-client'
import { readState, writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function getSlug(): Promise<HerokuApiResGetSlug['slug']> {
  const state = readState('staging')

  if (!state) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }

  const appName = state.appName
  console.log(`retreiving slug id for current ${appName} release...`)
  const releases: HerokuApiResGetSlug[] = await heroku.get(`/apps/${appName}/releases`)
  const latest = releases.find((release: { current: string }) => release.current)

  if (!latest) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }
  console.log(`latest staging slug id found and writing to state file: ${latest.slug.id}`)
  writeState('staging', { slugId: latest.slug.id })

  return latest.slug
}
