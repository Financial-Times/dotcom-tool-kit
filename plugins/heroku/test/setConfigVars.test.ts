import { describe, it, expect, jest } from '@jest/globals'
import { setAppConfigVars, setStageConfigVars } from '../src/setConfigVars'
import { DopplerEnvVars, Source as SecretsSource } from '@dotcom-tool-kit/doppler'
import heroku from '../src/herokuClient'
import winston, { Logger } from 'winston'
const logger = (winston as unknown) as Logger
/* eslint-disable @typescript-eslint/no-unused-vars */
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

const secrets = {
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
  environment: string

  static secretsSource: SecretsSource
  // Intentional unused parameter as pre-fixed with an underscore
  // eslint-disable-next-line no-unused-vars
  constructor(_settings: DopplerPath) {
    this.dopplerPath = dopplerPath
    this.environment = environment
  }
  get() {
    return secrets
  }
  getWithSource() {
    return { secrets, source: DopplerEnvVarsMock.secretsSource }
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
jest.mock('@dotcom-tool-kit/doppler', () => {
  return {
    DopplerEnvVars: jest.fn((settings: DopplerPath) => new DopplerEnvVarsMock(settings))
  }
})

describe('setConfigVars', () => {
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

  it('does not set config vars when Doppler is in use', async () => {
    // HACK:20230928:IM there's probably a better way to do this but I don't
    // enjoy playing with Jest mocks
    DopplerEnvVarsMock.secretsSource = 'doppler'
    await setAppConfigVars(logger, appName, environment, systemCode)

    expect(heroku.patch).not.toBeCalled()
    DopplerEnvVarsMock.secretsSource = 'vault'
  })
})
