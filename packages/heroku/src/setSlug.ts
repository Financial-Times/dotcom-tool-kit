import Heroku from 'heroku-client'
import { readState } from '@dotcom-tool-kit/state'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN

export default async function setSlug(slugId: string): Promise<string> {
  //TODO: find a better way to get the app name
  const repo = readState('ci')?.repo
  const appName = `ft-${repo}-eu`

  const heroku = new Heroku({ token: HEROKU_API_TOKEN })
  const latestRelease = await heroku.post(`/apps/${appName}/releases`, {
    slug: slugId
  })

  return latestRelease.id
}
