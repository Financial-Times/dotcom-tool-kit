import heroku from './herokuClient'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import type { VaultPath } from '@dotcom-tool-kit/vault'

export default async function setConfigVars(
  appIdName: string,
  environment: string,
  vaultPath: VaultPath,
  reviewProd = false
): Promise<void> {
  try {
    const settings = {
      environment: environment,
      vaultPath: vaultPath
    }

    console.log(`setting config vars for ${appIdName}`)

    const vaultEnvVars = new VaultEnvVars(settings)

    let configVars = await vaultEnvVars.get()

    if (reviewProd) {
      configVars = { ...configVars, NODE_ENV: 'production' }
    }

    await heroku.patch(`/apps/${appIdName}/config-vars`, { body: configVars })

    console.log('the following values have been set:', Object.keys(configVars).join(', '))

    console.log(`${appIdName} config vars have been updated successfully.`)
  } catch (err) {
    const error = new ToolKitError(`Error updating config vars`)
    if (err instanceof Error) {
      error.details = err.message
    }
    throw error
  }
}
