import { describe, expect, it, jest } from '@jest/globals'

import { readState, writeState } from '@dotcom-tool-kit/state'

import { getHerokuStagingApp } from '../src/getHerokuStagingApp'
import heroku from '../src/herokuClient'

const stagingState = {
  appIds: ['staging-app-id'],
  appName: ''
}

const name = 'staging-app-name'

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    readState: jest.fn(() => {
      return stagingState
    }),
    writeState: jest.fn()
  }
})

const mockHerokuGet = jest.spyOn(heroku, 'get')

describe('getHerokuStagingApp', () => {
  it('retreives data from state', async () => {
    mockHerokuGet.mockImplementationOnce(async () => Promise.resolve({ name }))

    await getHerokuStagingApp()

    expect(readState).toBeCalledTimes(1)
  })

  it('writes app name to state', async () => {
    mockHerokuGet.mockImplementationOnce(async () => Promise.resolve({ name }))
    await getHerokuStagingApp()

    expect(writeState).toBeCalledWith('staging', { appName: 'staging-app-name' })
  })

  it('returns the app name', async () => {
    mockHerokuGet.mockImplementationOnce(async () => Promise.resolve({ name }))
    const appName = await getHerokuStagingApp()

    expect(appName).toEqual(name)
  })

  it('does not throw when successful', async () => {
    mockHerokuGet.mockImplementationOnce(async () => Promise.resolve({ name }))
    await expect(getHerokuStagingApp()).resolves.not.toThrow()
  })

  it('throws when unsuccessful', async () => {
    mockHerokuGet.mockImplementationOnce(async () => Promise.reject())

    await expect(getHerokuStagingApp()).rejects.toThrow()
  })
})
