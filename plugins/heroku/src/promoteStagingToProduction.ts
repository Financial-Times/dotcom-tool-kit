import heroku, { extractHerokuError } from './herokuClient.js'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState } from '@dotcom-tool-kit/state'
import { gtg } from './gtg.js'
import type { Logger } from 'winston'
import { setAppConfigVars } from './setConfigVars.js'
import { HerokuApiResPost } from 'heroku-client'

async function promoteStagingToProduction(
  logger: Logger,
  slug: string,
  systemCode?: string
): Promise<void[]> {
  const state = readState(`production`)

  if (!state) {
    throw new ToolKitError('Could not find production state information')
  }

  const appIds = state.appIds

  logger.info(`updating slug id ${slug} on production app ${appIds}`)

  const latestRelease = appIds.map((appId) =>
    heroku
      .post<HerokuApiResPost>(`/apps/${appId}/releases`, {
        body: {
          slug
        }
      })
      .catch(extractHerokuError(`promoting app ID ${appId} to production`))
      .then((response) => gtg(logger, response.app.name, 'production'))
  )

  for (const id of appIds) {
    await setAppConfigVars(logger, id, 'prod', systemCode)
  }

  return Promise.all(latestRelease)
}

export { promoteStagingToProduction }
