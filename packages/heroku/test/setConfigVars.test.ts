import { describe, it, expect, jest } from '@jest/globals'
import { setConfigVars } from '../src/setConfigVars'
import { VaultEnvVars } from '@dotcom-tool-kit/vault'

/* eslint-disable @typescript-eslint/no-unused-vars */

type VaultPath = {
  team: string
  app: string
}

const environment = 'staging'
const appName = 'test-staging-app-name'
const vaultPath = {
  team: 'vault-team',
  app: 'vault-app'
}

const secrets = {
  secret1: 'secret-1',
  secret2: 'secret-2',
  secret3: 'secret-3'
}

const patch = {
  path: '',
  body: {}
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
      patch.path = str
      patch.body = options.body
    })
  }
})

jest.mock('@dotcom-tool-kit/vault', () => {
  return {
    VaultEnvVars: jest.fn((settings: VaultPath) => new VaultEnvVarsMock(settings))
  }
})

describe('setConfigVars', () => {
  it('returns passes its settings to vault env vars and recieves secrets ', async () => {
    await setConfigVars(appName, environment, vaultPath)

    const settings = {
      environment,
      vaultPath
    }

    expect(VaultEnvVars).toHaveBeenLastCalledWith(settings)
  })

  it('sends an update to the app with the correct path and body', async () => {
    await setConfigVars(appName, environment, vaultPath)

    expect(patch.path).toEqual('/apps/test-staging-app-name/config-vars')
    expect(patch.body).toEqual(secrets)
  })

  it('throws if the app was not patched with config vars', async () => {
    await expect(setConfigVars('wrong-app-name', environment, vaultPath)).rejects.toThrowError()
  })

  it('resolves if successful', async () => {
    await expect(setConfigVars(appName, environment, vaultPath)).resolves.not.toThrow()
  })
})
