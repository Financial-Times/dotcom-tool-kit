import type { HerokuApiResGetGtg } from 'heroku-client'
import type { Logger } from 'winston'

import { ToolKitError } from '@dotcom-tool-kit/error'
import { waitForOk } from '@dotcom-tool-kit/wait-for-ok'
import { type State, writeState } from '@dotcom-tool-kit/state'

import heroku, { extractHerokuError } from './herokuClient'

async function gtg(logger: Logger, appIdOrName: string, environment: keyof State): Promise<void> {
  const appDetails = await heroku
    .get<HerokuApiResGetGtg>(`/apps/${appIdOrName}`)
    .catch(extractHerokuError(`getting details for app ${appIdOrName}`))
  // save name to state file so we don't need to translate app ID again
  writeState(environment, {
    appName: appDetails.name,
    url: appDetails.web_url ?? undefined
  })

  if (!appDetails.web_url) {
    const error = new ToolKitError(`app ${appIdOrName} has no web URL associated with it`)
    error.details =
      'please send #cp-platforms-team the name/ID of the app so we can understand why this would happen'
    throw error
  }

  const gtgUrl = new URL(appDetails.web_url)
  gtgUrl.pathname = '/__gtg'
  return waitForOk(logger, gtgUrl.href)
}

export { gtg }
