import heroku from './herokuClient'
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
  logger.info(`scaling dyno for ${appName}...`)

  const appFormation: HerokuApiResPatch[] = await heroku.patch(`/apps/${appName}/formation`, {
    body: {
      updates: [{ quantity, size, type }]
    }
  })

  const appFormationFilteredByType = appFormation.filter(formation => formation.type === type);
  if (appFormationFilteredByType[0].quantity === quantity && appFormationFilteredByType[0].type === type) {
    return
  } else {
    throw new ToolKitError(`something went wrong with scaling the dyno`)
  }
}

export { scaleDyno }
