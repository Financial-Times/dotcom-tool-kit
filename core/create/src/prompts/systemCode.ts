import { styles } from '@dotcom-tool-kit/logger'
import prompt from 'prompts'
import type { PackageJson } from 'type-fest'
import { BizOpsSystem, getBizOpsSystem } from '../bizOps'

export interface ConfirmationParams {
  packageJson: PackageJson
}

export default async ({ packageJson }: ConfirmationParams): Promise<BizOpsSystem | undefined> => {
  const guessedSystemCode = packageJson.name
  let bizOpsSystem
  try {
    if (!guessedSystemCode) {
      // fall back to the prompt if we don't have a system code to guess
      throw new Error()
    }
    // try to guess the system code then assume an error means the guess was
    // wrong
    bizOpsSystem = await getBizOpsSystem(guessedSystemCode)
  } catch {
    const { systemCode } = await prompt({
      name: 'systemCode',
      type: 'text',
      message: `what's your system code? ${styles.dim(
        `(${
          guessedSystemCode
            ? `failed to get system for ${guessedSystemCode}`
            : "couldn't find system code in package.json"
        })`
      )}`
    })
    if (systemCode) {
      bizOpsSystem = await getBizOpsSystem(systemCode)
    }
  }
  return bizOpsSystem
}
