import heroku, { extractHerokuError } from './herokuClient'
import type { HerokuApiResGetGtg } from 'heroku-client'
import type { Logger } from 'winston'
import { waitForOk } from '@dotcom-tool-kit/wait-for-ok'
import { State, writeState } from '@dotcom-tool-kit/state'

async function gtg(logger: Logger, appIdName: string, environment: keyof State, id = true): Promise<void> {
  let appName = appIdName
  // gtg called with id rather than name; get name from Heroku
  if (id) {
    const appDetails = await heroku
      .get<HerokuApiResGetGtg>(`/apps/${appIdName}`)
      .catch(extractHerokuError(`getting app name for app ${appIdName}`))
    appName = appDetails.name
  }
  // save name to state file
  writeState(environment, {
    appName
  })
  const url = `https://${appName}.herokuapp.com/__gtg`

  return waitForOk(logger, url)
}

export { gtg }
