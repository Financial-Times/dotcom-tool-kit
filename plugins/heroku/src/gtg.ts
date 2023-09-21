import heroku, { extractHerokuError } from './herokuClient'
import type { HerokuApiResGetGtg } from 'heroku-client'
import type { Logger } from 'winston'
import { waitForOk } from '@dotcom-tool-kit/wait-for-ok'
import { State, writeState } from '@dotcom-tool-kit/state'

async function gtg(logger: Logger, appIdName: string, environment: keyof State, id = true): Promise<void> {
  const appDetails = await heroku
    .get<HerokuApiResGetGtg>(`/apps/${appIdName}`)
    .catch(extractHerokuError(`getting app name for app ${appIdName}`))
  let appName = appDetails.name
  let url = `https://${appName}.herokuapp.com/__gtg`

  // prefer the application web_url for the gtg endpoint.
  if (appDetails.web_url) {
    const webUrl = new URL(appDetails.web_url)
    webUrl.path = "/__gtg"
    url = webUrl
  }
  
  // save name to state file
  writeState(environment, {
    appName
  })

  return waitForOk(logger, url)
}

export { gtg }
