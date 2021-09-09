import heroku from './herokuClient'
import type { HerokuApiResGetSlug } from 'heroku-client'
import { readState, writeState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function getSlug(): Promise<string> {
  const state = readState('staging')

  if (!state) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }

  let appName = state.appName
  const releases: HerokuApiResGetSlug[] = await heroku.get(`/apps/${appName}/releases`)
  const latest = releases.find((release: { current: string }) => release.current)

  if (!latest) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }

  appName = appName.replace('-staging', '')

  writeState('production', { appName })

  return latest.slug.id
}
