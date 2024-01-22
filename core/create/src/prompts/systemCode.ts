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
  if (guessedSystemCode) {
    bizOpsSystem = await getBizOpsSystem(guessedSystemCode)
  }
  if (!bizOpsSystem) {
    // try to guess the system code then assume an error means the guess was
    // wrong
    const { systemCode } = await prompt({
      name: 'systemCode',
      type: 'text',
      message: `what's your system code? leave this field blank if this is not a system ${styles.dim(
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
