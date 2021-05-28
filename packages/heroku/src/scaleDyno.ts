// @ts-ignore
import Heroku from 'heroku-client'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;

export interface Formation {
    quantity: number
    type: string
}

export default async function scaleDyno(appName: string, quantity: number, type: string = 'web'): Promise<void> {

    const heroku = new Heroku({ token: HEROKU_API_TOKEN })

    const appFormation = await heroku.patch(`/apps/ft-${appName}/formation`, {
        "updates": [
            {
              "quantity": quantity,
              "type": type
            }
          ]
        })

    if (appFormation.quantity === quantity && appFormation.type === type) {
        return
    } else {
        process.exit(1)
    }
}