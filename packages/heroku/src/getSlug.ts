import { HerokuApiResGetSlug } from 'heroku-client'
import heroku from './herokuClient'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function getSlug(): Promise<string> {
  const state = readState('staging')

  if (!state) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }

  const appName = state.appName
  const releases: HerokuApiResGetSlug = await heroku.get(`/apps/${appName}/releases`)
  const latest = releases.find((release: { current: string }) => release.current)

  if (!latest) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }
  return latest.id
}
