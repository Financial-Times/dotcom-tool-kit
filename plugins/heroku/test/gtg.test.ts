import { waitForOk } from '@dotcom-tool-kit/wait-for-ok'
import { describe, it, expect, jest } from '@jest/globals'
import heroku from '../src/herokuClient'
import { gtg } from '../src/gtg'
import { writeState } from '@dotcom-tool-kit/state'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

const appName = 'test-app-name'
const makeUrl = (appName: string) => `https://${appName}-1234567890ab.herokuapp.com/`

jest.mock('../src/herokuClient', () => {
  const originalModule = jest.requireActual('../src/herokuClient') as object
  return {
    __esmodule: true,
    ...originalModule,
    get: jest.fn(async (apiPath: string) => {
      // gets app ID/name parameter and 'resolves' IDs to names
      const appName = apiPath.slice(apiPath.lastIndexOf('/') + 1).replace('-id', '-name')
      return { name: appName, web_url: makeUrl(appName) }
    })
  }
})

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    writeState: jest.fn()
  }
})

jest.mock('@dotcom-tool-kit/wait-for-ok', () => {
  return {
    waitForOk: jest.fn((_, url: string) => {
      return url.includes(appName) ? Promise.resolve() : Promise.reject(new Error(`😢`))
    })
  }
})

describe('gtg', () => {
  it('makes an api call to heroku to get name from ID', async () => {
    await gtg(logger, 'test-app-id', 'staging')

    expect(heroku.get).toHaveBeenCalledTimes(1)
  })

  it('writes app name to state file', async () => {
    await gtg(logger, appName, 'staging')

    expect(writeState).toBeCalledWith('staging', { appName: 'test-app-name' })
  })

  it('calls wait for ok with the correct url', async () => {
    await gtg(logger, appName, 'staging')

    expect(waitForOk).toBeCalledWith(logger, makeUrl(appName) + '__gtg')
  })

  it('throws an error if the app fails to respond', async () => {
    await expect(gtg(logger, 'wrong-app-name', 'staging')).rejects.toThrowError()
  })

  it('resolves if successful', async () => {
    await expect(gtg(logger, appName, 'staging')).resolves.not.toThrow()
  })
})
