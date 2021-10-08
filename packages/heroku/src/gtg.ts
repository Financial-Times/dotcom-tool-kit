import heroku from './herokuClient'
import type { HerokuApiResGetGtg } from 'heroku-client'
import waitForOk from '@dotcom-tool-kit/wait-for-ok'
import { State, writeState } from '@dotcom-tool-kit/state'

async function gtg(appIdName: string, environment: keyof State, id = true): Promise<void> {
  let appName = appIdName
  //gtg called with id rather than name; get name from Heroku
  if (id) {
    const appDetails: HerokuApiResGetGtg = await heroku.get(`/apps/${appIdName}`)
    appName = appDetails.name
  }
  //save name to state file
  writeState(environment, { appName })

  const url = `https://${appName}.herokuapp.com/__gtg`

  return waitForOk(url)
}

export { gtg }
