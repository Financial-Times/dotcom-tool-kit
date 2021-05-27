// @ts-ignore
import Heroku from 'heroku-client'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;

export interface Formation {
    quantity: number
    type: string
}

export default async function scaleUpDyno(appName: string, quantity: number = 1, type: string = 'web'): Promise<void> {

    const heroku = new Heroku({ token: HEROKU_API_TOKEN })

    heroku.patch(`/apps/ft-${appName}/formation`, {
        "updates": [
            {
              "quantity": quantity,
              "type": type
            }
          ]
    }).then((body: Formation) => {
        if (body.quantity === quantity && body.type === type) {
            return true
        } else {
            process.exit(1)
        }
    })
    return
}