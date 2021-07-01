import Heroku, { HerokuApiResGetSlug } from 'heroku-client'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN

export default async function getSlug(): Promise<string> {
  const state = readState('staging')

  if (!state) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }

  const appName = state.appName
  const heroku = new Heroku({ token: HEROKU_API_TOKEN })
  const releases: HerokuApiResGetSlug = await heroku.get(`/apps/${appName}/releases`)
  const latest = releases.find((release: { current: string }) => release.current)

  if (!latest) {
    throw new ToolKitError('Could not find state for staging, check that deploy:staging ran successfully')
  }
  return latest.id
}
