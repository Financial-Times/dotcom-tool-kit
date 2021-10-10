import { describe, it, expect, jest } from '@jest/globals'
import { getHerokuStagingApp } from '../src/getHerokuStagingApp'
import { readState } from '@dotcom-tool-kit/state'

const ciState = {
  version: 'ci-version'
}

const stagingState = {
  appIds: ['staging-app-id'],
  appName: ''
}

const name = 'staging-app-name'

let paraName: string
let paraVersion: string

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    readState: jest.fn((str: string) => {
      return str.includes('ci') ? ciState : stagingState
    }),
    writeState: jest.fn((stage: string, { appName }) => {
      console.log('app name', { appName })
      stagingState.appName = appName
      return
    })
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
    writeLatestReleaseDetails: jest.fn((appName: string, version: string) => {
      paraName = appName
      paraVersion = version
    })
  }
})

describe('getHerokuStagingApp', () => {
  it('calls retreives data from state', async () => {
    await getHerokuStagingApp()

    expect(readState).toBeCalledTimes(2)
  })

  it('writes app name to state', async () => {
    await getHerokuStagingApp()

    expect(stagingState.appName).toEqual('staging-app-name')
  })

  it('writes latest release details without throwing', async () => {
    await getHerokuStagingApp()

    expect(paraName).toEqual(stagingState.appName)
    expect(paraVersion).toEqual(ciState.version)
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
