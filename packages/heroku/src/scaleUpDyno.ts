// @ts-ignore
import Heroku from 'heroku-client'
import getCIVars from './getCIVars'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;

export interface Formation {
    quantity: number
    type: string
}

export default async function scaleUpDyno(staging: boolean=false, quantity: number = 1, type: string = 'web'): Promise<void> {
    const { repo } = await getCIVars(['repo'])
    const appName = staging ? `ft-${repo}-staging` : `ft-${repo}`

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