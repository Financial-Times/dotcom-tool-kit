import { describe, it, expect, jest } from '@jest/globals'
import { setStageConfigVars } from '../src/setStageConfigVars'
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
const pipelineName = 'test-pipeline-name'
const pipeline = {
  id: 'test-pipeline-id'
} 

const secrets = {
  secret1: 'secret-1',
  secret2: 'secret-2',
  secret3: 'secret-3'
}

const prodPatchBody = {
  body: {
    SYSTEM_CODE: 'test-system-code',
    ...secrets
  }
}

const reviewPatchBody = {
  body: secrets
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
    patch: jest.fn(),
    get: jest.fn((str: string) => {
      if (str.includes('wrong')) {
        throw new Error()
      }
      return {id: 'test-pipeline-id'}
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
    await setStageConfigVars(logger, 'staging', environment, pipelineName)

    const settings = {
      environment
    }
    expect(VaultEnvVars).toHaveBeenLastCalledWith(logger, settings)
  })

  it('sends calls heroku api with the correct path and body with system code', async () => {
    await setStageConfigVars(logger, 'staging', environment, pipelineName, systemCode)

    expect(heroku.patch).toBeCalledWith(`/pipelines/${pipeline.id}/stage/staging/config-vars`, prodPatchBody)
  })

  it('sends an update to the app with the correct path and body for review-app', async () => {
    await setStageConfigVars(logger, 'review', 'production', pipelineName)

    expect(heroku.patch).toBeCalledWith(`/pipelines/${pipeline.id}/stage/review/config-vars`, reviewPatchBody)
  })

  it('stage function throws if the app was not patched with config vars', async () => {
    await expect(setStageConfigVars(logger, 'staging', environment, 'wrong-pipeline-name')).rejects.toThrowError()
  })

  it('resolves if successful', async () => {
    await expect(setStageConfigVars(logger, 'review', 'production', pipelineName)).resolves.not.toThrow()
  })
})