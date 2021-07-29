import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import type { VaultPath } from '@dotcom-tool-kit/vault'

export default async function setConfigVars(
  appId: string,
  environment: string,
  vaultPath: VaultPath
): Promise<void> {
  try {
    const settings = {
      environment: environment,
      vaultPath: vaultPath
    }

    const vaultEnvVars = new VaultEnvVars(settings)

    const configVars = await vaultEnvVars.get()

    await heroku.patch(`/apps/${appId}/config-vars`, { body: configVars })

    console.log('Following values have been set:', Object.keys(configVars).join(', '))

    console.log(`${appId} config vars have been updated successfully.`)
  } catch (err) {
    const error = new ToolKitError(`Error updating config vars`)
    error.details = err.message
    throw error
  }
}
