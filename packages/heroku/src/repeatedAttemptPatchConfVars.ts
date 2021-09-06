import pRetry from 'p-retry'
import heroku from './herokuClient'
import { Secrets } from '@dotcom-tool-kit/vault/src'

export default async function repeatedAttemptPatchConfVars(
  appId: string,
  configVars: Secrets
): Promise<void> {
  async function patchAppConfigVars() {
    try {
      await heroku.patch(`/apps/${appId}/config-vars`, { body: configVars })
      console.log('Following values have been set:', Object.keys(configVars).join(', '))
      console.log(`${appId} config vars have been updated successfully.`)
    } catch {
      throw new Error(`Waiting for ${appId} to be fully initialised`)
    }
    return true
  }

  await pRetry(patchAppConfigVars, {
    onFailedAttempt: (error) => {
      const { attemptNumber, retriesLeft } = error
      console.log(
        `Patching config variables attempt ${attemptNumber} failed. There are ${retriesLeft} retries left.`
      )
    },
    factor: 1,
    retries: 10,
    minTimeout: 10 * 1000
  })
  return
}
