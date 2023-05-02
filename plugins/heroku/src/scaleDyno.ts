import heroku, { extractHerokuError } from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'
import type { HerokuApiResPatch } from 'heroku-client'
import type { Logger } from 'winston'

async function scaleDyno(
  logger: Logger,
  appName: string,
  quantity: number,
  type = 'web',
  size?: string
): Promise<void> {
  logger.info(`scaling ${type} dyno for ${appName}...`)
  const appFormation = await heroku
    .patch<HerokuApiResPatch[]>(`/apps/${appName}/formation`, {
      body: {
        updates: [
          {
            quantity,
            size,
            type
          }
        ]
      }
    })
    .catch(extractHerokuError(`updating scaling for app ${appName}`))
  if (appFormation.some((formation) => formation.type === type && formation.quantity === quantity)) {
    return
  } else {
    throw new ToolKitError(`something went wrong with scaling the dyno`)
  }
}

export { scaleDyno }
