// @ts-ignore
import Heroku from 'heroku-client'
import waitForOk from '@dotcom-tool-kit/wait-for-ok'
import { writeState } from '@dotcom-tool-kit/state'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;

export default async function gtg (appIdName:string, environment: string) {
    const heroku = new Heroku({ token: HEROKU_API_TOKEN })

    let appName = appIdName

    if (!appName.startsWith('ft')) {
        const appDetails = await heroku.get(`/apps/${appIdName}`)
        appName = appDetails.name
        writeState(environment, 'appName', appName)
    }
    //save name to state file
    const url = `https://${appName}.herokuapp.com/__gtg"`

    return waitForOk(url)
}