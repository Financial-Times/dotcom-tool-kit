import Heroku from 'heroku-client'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN

export default async function setSlug(slugId: string): Promise<string> {
  //TODO: find a better way to get the app name
  const state = readState(`ci`)

  if (!state) {
    throw new ToolKitError('Could not find CI') //TODO - remidating actions?
  }
  const repo = state.repo
  const appName = `ft-${repo}-eu`

  const heroku = new Heroku({ token: HEROKU_API_TOKEN })
  const latestRelease = await heroku.post(`/apps/${appName}/releases`, {
    slug: slugId
  })

  return latestRelease.id
}
