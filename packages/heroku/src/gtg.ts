// @ts-ignore
import Heroku from 'heroku-client'
import waitForOk from '@dotcom-tool-kit/wait-for-ok'

const HEROKU_API_TOKEN = process.env.HEROKU_API_TOKEN;

export default async function gtg (appId:string) {
    const heroku = new Heroku({ token: HEROKU_API_TOKEN })

    const { name } = await heroku.get(`/apps/${appId}`)
    //save name to state file
    const url = `https://${name}.herokuapp.com/__gtg"`

    return waitForOk(url)
}

