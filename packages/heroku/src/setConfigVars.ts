import { ToolKitError } from '@dotcom-tool-kit/error'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import repeatedAttemptPatchConfVars from './repeatedAttemptPatchConfVars'
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

    await repeatedAttemptPatchConfVars(appId, configVars)
  } catch (err) {
    const error = new ToolKitError(`Error updating config vars`)
    if (err instanceof Error) {
      error.details = err.message
    }
    throw error
  }
  return
}
