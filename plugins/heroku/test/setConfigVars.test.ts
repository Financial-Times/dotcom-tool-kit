import { describe, it, expect, jest } from '@jest/globals'
import { setAppConfigVars, setStageConfigVars } from '../src/setConfigVars.js'
import { DopplerEnvVars } from '@dotcom-tool-kit/doppler'
import heroku from '../src/herokuClient.js'
import winston, { Logger } from 'winston'
const logger = (winston as unknown) as Logger
type DopplerPath = {
  project: string
}
const environment = 'prod'
const appName = 'test-staging-app-name'
const dopplerPath: DopplerPath = {
  project: 'doppler-app'
}
const systemCode = 'test-system-code'
const pipeline = {
  id: 'test-pipeline-id'
}
const pipelineName = 'test-pipeline-name'

const secrets: Record<string, string> = {
  secret1: 'secret-1',
  secret2: 'secret-2',
  secret3: 'secret-3'
}

const prodPatchBody = {
  body: {
    REGION: 'EU',
    SYSTEM_CODE: 'test-system-code',
    ...secrets
  }
}

const reviewPatchBody = {
  body: secrets
}
class DopplerEnvVarsMock {
  dopplerPath: DopplerPath
  constructor(_dopplerPath: DopplerPath, public environment: string, private migrated: boolean) {
    this.dopplerPath = dopplerPath
  }
  fallbackToVault() {
    return this.environment === 'ci' ? { MIGRATED_TO_DOPPLER: this.migrated ? 'true' : undefined } : secrets
  }
}
jest.mock('../src/herokuClient', () => {
  const originalModule = jest.requireActual('../src/herokuClient') as object
  return {
    __esmodule: true,
    ...originalModule,
    patch: jest.fn(async (str: string) => {
      if (str.includes('wrong')) {
        throw new Error()
      }
    }),
    get: jest.fn(async (str: string) => {
      if (str.includes('wrong')) {
        throw new Error()
      }
      return {
        id: 'test-pipeline-id',
        region: {
          name: 'eu'
        }
      }
    })
  }
})
const DopplerEnvVarsMocked = jest.mocked<any>(DopplerEnvVars, true)
jest.mock('@dotcom-tool-kit/doppler')
function mockDopplerEnvVars(migrated: boolean) {
  DopplerEnvVarsMocked.mockImplementation(
    (dopplerPath, environment) => new DopplerEnvVarsMock(dopplerPath, environment, migrated)
  )
}

describe('setConfigVars', () => {
  beforeEach(() => {
    DopplerEnvVarsMocked.mockReset()
    mockDopplerEnvVars(false)
  })

  it('passes its settings to doppler env vars and receives secrets ', async () => {
    await setAppConfigVars(logger, appName, environment, systemCode)

    expect(DopplerEnvVars).toHaveBeenLastCalledWith(logger, environment)
  })

  it('sends an update to the app with the correct path and body for prod and staging', async () => {
    await setAppConfigVars(logger, appName, environment, systemCode)

    expect(heroku.patch).toBeCalledWith('/apps/test-staging-app-name/config-vars', prodPatchBody)
  })

  it('sends an update to the app with the correct path and body for review-app', async () => {
    await setStageConfigVars(logger, 'review', 'prod', pipelineName)

    expect(heroku.patch).toBeCalledWith(`/pipelines/${pipeline.id}/stage/review/config-vars`, reviewPatchBody)
  })

  it('app function throws if the app was not patched with config vars', async () => {
    await expect(setAppConfigVars(logger, 'wrong-app-name', environment, systemCode)).rejects.toThrowError()
  })

  it('stage function throws if the app was not patched with config vars', async () => {
    await expect(setStageConfigVars(logger, 'review', environment, 'wrong-pipeline')).rejects.toThrowError()
  })

  it('resolves if successful', async () => {
    await expect(setAppConfigVars(logger, appName, environment, systemCode)).resolves.not.toThrow()
  })

  it("does not set config vars when we've migrated to Doppler", async () => {
    mockDopplerEnvVars(true)
    await setAppConfigVars(logger, appName, environment, systemCode)

    expect(heroku.patch).not.toBeCalled()
  })
})
