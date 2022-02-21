import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { readState } from '@dotcom-tool-kit/state'
import { gtg } from './gtg'
import type { Logger } from 'winston'
import { setStageConfigVars } from './setStageConfigVars'

async function promoteStagingToProduction(logger: Logger, slug: string, pipelineName: string, systemCode?: string): Promise<void[]> {
  const state = readState(`production`)

  if (!state) {
    throw new ToolKitError('Could not find production state information')
  }

  await setStageConfigVars(logger, 'production', 'production', pipelineName, systemCode)

  const appIds = state.appIds

  logger.info(`updating slug id ${slug} on production app ${appIds}`)

  const latestRelease = appIds.map((appId) =>
    heroku
      .post(`/apps/${appId}/releases`, {
        body: {
          slug
        }
      })
      .catch((err) => {
        const error = new ToolKitError(
          `there was an error with setting the slug on your production app id: ${appId}`
        )
        error.details = err
        throw error
      })
      .then((response) => gtg(logger, response.app.name, 'production', false))
  )
  
  return Promise.all(latestRelease)
}

export { promoteStagingToProduction }
