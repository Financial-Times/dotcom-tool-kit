import { waitForOk } from '@dotcom-tool-kit/wait-for-ok'
import { describe, it, expect, jest } from '@jest/globals'
import heroku from '../src/herokuClient'
import { gtg } from '../src/gtg'

const appName = 'test-app-name'

type State = {
  [key: string]: string
}

const state: State = {}

jest.mock('../src/herokuClient', () => {
  return {
    get: jest.fn(() => ({ name: appName }))
  }
})

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    writeState: jest.fn((environment: string, { appName }) => {
      state[environment] = appName
    })
  }
})

jest.mock('@dotcom-tool-kit/wait-for-ok', () => {
  return {
    waitForOk: jest.fn((url: string) => {
      return url.includes('test-app-name') ? Promise.resolve() : Promise.reject(new Error(`😢`))
    })
  }
})

describe('gtg', () => {
  it('makes an api call to heroku if passed an id', async () => {
    await gtg('test-app-id', 'staging')

    expect(heroku.get).toHaveBeenCalledTimes(1)
  })

  it("doesn't make an api call to heroku if passed a name", async () => {
    await gtg(appName, 'staging', false)

    expect(heroku.get).toHaveBeenCalledTimes(0)
  })

  it('writes app name to state file', async () => {
    await gtg(appName, 'staging', false)

    expect(state.staging).toEqual(appName)
  })

  it('calls wait for ok with the correct url', async () => {
    await gtg(appName, 'staging', false)

    const url = `https://${appName}.herokuapp.com/__gtg`

    expect(waitForOk).toBeCalledWith(url)
  })

  it('throws an error if the app fails to respond', async () => {
    await expect(gtg('wrong-app-name', 'staging', false)).rejects.toThrowError()
  })

  it('resolves if successful', async () => {
    await expect(gtg(appName, 'staging', false)).resolves.not.toThrow()
  })
})
