import { describe, it, expect, jest } from '@jest/globals'
import { getHerokuStagingApp } from '../src/getHerokuStagingApp'
import { readState, writeState } from '@dotcom-tool-kit/state'
import { writeLatestReleaseDetails } from '../src/writeLatestReleaseDetails'

const ciState = {
  version: 'ci-version'
}

const stagingState = {
  appIds: ['staging-app-id'],
  appName: ''
}

const name = 'staging-app-name'

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    readState: jest.fn((str: string) => {
      return str.includes('ci') ? ciState : stagingState
    }),
    writeState: jest.fn()
  }
})

jest.mock('../src/herokuClient', () => {
  return {
    get: jest.fn((str: string) => {
      return str.includes('staging-app-id') ? { name } : null
    })
  }
})

jest.mock('../src/writeLatestReleaseDetails', () => {
  return {
    writeLatestReleaseDetails: jest.fn()
  }
})

describe('getHerokuStagingApp', () => {
  it('retreives data from state', async () => {
    await getHerokuStagingApp()

    expect(readState).toBeCalledTimes(2)
  })

  it('writes app name to state', async () => {
    await getHerokuStagingApp()

    expect(writeState).toBeCalledWith('staging', { appName: 'staging-app-name' })
  })

  it('calls writeLatestReleaseDetails with correct parameters', async () => {
    await getHerokuStagingApp()

    expect(writeLatestReleaseDetails).toBeCalledWith('staging-app-name', 'ci-version')
  })

  it('returns the app name', async () => {
    const appName = await getHerokuStagingApp()

    expect(appName).toEqual(name)
  })

  it('does not throw when successful', async () => {
    await expect(getHerokuStagingApp()).resolves.not.toThrow()
  })

  it('throws when unsuccessful', async () => {
    stagingState.appIds[0] = 'wrong-id'

    await expect(getHerokuStagingApp()).rejects.toThrowError()
  })
})
