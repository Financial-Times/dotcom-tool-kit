import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function scaleDyno(appName: string, quantity: number, type = 'web'): Promise<void> {
  console.log(`scaling dyno for ${appName}...`)

  const appFormation = await heroku.patch(`/apps/${appName}/formation`, {
    body: {
      updates: [
        {
          quantity: quantity,
          type: type
        }
      ]
    }
  })

  if (appFormation.quantity === quantity && appFormation.type === type) {
    return
  } else {
    throw new ToolKitError(`something went wrong with scaling the dyno`)
  }
}
