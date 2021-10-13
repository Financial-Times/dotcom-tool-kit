import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState } from '@dotcom-tool-kit/state'
import { gtg } from './gtg'

function setSlug(slug: string): Promise<void[]> {
  const state = readState(`production`)

  if (!state) {
    throw new ToolKitError('Could not find production state information')
  }

  const appIds = state.appIds

  console.log(`updating slug id ${slug} on production app ${appIds}`)
  const latestRelease = appIds.map((appId) =>
    heroku
      .post(`/apps/${appId}/releases`, {
        body: {
          slug
        }
      })
      .then((response) => gtg(response.app.name, 'production', false))
  )

  return Promise.all(latestRelease)
}

export { setSlug }
