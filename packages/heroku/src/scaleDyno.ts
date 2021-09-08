import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'
import type { HerokuApiResPatch } from 'heroku-client'

export default async function scaleDyno(appName: string, quantity: number, type = 'web'): Promise<void> {
  console.log(`scaling dyno for ${appName}...`)

  const appFormation: HerokuApiResPatch[] = await heroku.patch(`/apps/${appName}/formation`, {
    body: {
      updates: [
        {
          quantity: quantity,
          type: type
        }
      ]
    }
  })

  if (appFormation[0].quantity === quantity && appFormation[0].type === type) {
    return
  } else {
    throw new ToolKitError(`something went wrong with scaling the dyno`)
  }
}
