import heroku from './herokuClient'
import { readState } from '@dotcom-tool-kit/state'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function setSlug(slugId: string): Promise<string> {
  const state = readState(`production`)

  if (!state) {
    throw new ToolKitError('Could not find production state information') //TODO - remidating actions?
  }
  const appName = state.appName

  const latestRelease = await heroku.post(`/apps/${appName}/releases`, {
    slug: slugId
  })

  return latestRelease.id
}
