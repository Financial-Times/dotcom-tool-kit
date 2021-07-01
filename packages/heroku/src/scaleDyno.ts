import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'

export default async function scaleDyno(appName: string, quantity: number, type = 'web'): Promise<void> {
  const appFormation = await heroku.patch(`/apps/ft-${appName}/formation`, {
    updates: [
      {
        quantity: quantity,
        type: type
      }
    ]
  })

  if (appFormation.quantity === quantity && appFormation.type === type) {
    return
  } else {
    throw new ToolKitError(`Something went wrong with scaling the dyno`)
  }
}
