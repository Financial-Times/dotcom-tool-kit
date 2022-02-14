import { describe, it, expect, jest } from '@jest/globals'
import { setConfigVars } from '../src/setConfigVars'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'
import heroku from '../src/herokuClient'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

/* eslint-disable @typescript-eslint/no-unused-vars */

type VaultPath = {
  team: string
  app: string
}

const environment = 'production'
const appName = 'test-staging-app-name'
const vaultPath = {
  team: 'vault-team',
  app: 'vault-app'
}
const systemCode = 'test-system-code'

const secrets = {
  secret1: 'secret-1',
  secret2: 'secret-2',
  secret3: 'secret-3'
}

const patchBody = {
  body: {
    SYSTEM_CODE: 'test-system-code',
    ...secrets
  }
}
class VaultEnvVarsMock {
  vaultPath: VaultPath
  environment: string

  constructor(settings: VaultPath) {
    this.vaultPath = vaultPath
    this.environment = environment
  }

  get() {
    return secrets
  }
}

jest.mock('../src/herokuClient', () => {
  return {
    patch: jest.fn((str: string, options: { [key: string]: { [key: string]: string } }) => {
      if (!str.includes('test-staging-app-name')) {
        throw new Error()
      }
    })
  }
})

jest.mock('@dotcom-tool-kit/vault', () => {
  return {
    VaultEnvVars: jest.fn((settings: VaultPath) => new VaultEnvVarsMock(settings))
  }
})

describe('setConfigVars', () => {
  it('passes its settings to vault env vars and receives secrets ', async () => {
    await setConfigVars(logger, appName, environment, systemCode)

    const settings = {
      environment
    }

    expect(VaultEnvVars).toHaveBeenLastCalledWith(logger, settings)
  })

  it('sends an update to the app with the correct path and body', async () => {
    await setConfigVars(logger, appName, environment, systemCode)

    expect(heroku.patch).toBeCalledWith('/apps/test-staging-app-name/config-vars', patchBody)
  })

  it('throws if the app was not patched with config vars', async () => {
    await expect(setConfigVars(logger, 'wrong-app-name', environment, systemCode)).rejects.toThrowError()
  })

  it('resolves if successful', async () => {
    await expect(setConfigVars(logger, appName, environment, systemCode)).resolves.not.toThrow()
  })
})
