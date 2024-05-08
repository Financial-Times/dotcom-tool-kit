import { describe, it, beforeAll, beforeEach, afterAll, jest, expect } from '@jest/globals'
import { VaultEnvVars } from '../src/index.js'
import fetch from '@financial-times/n-fetch'
import fs from 'fs'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

let CIRCLECI: string
if (process.env.CIRCLECI) {
  CIRCLECI = process.env.CIRCLECI
}
const VAULT_AUTH_GITHUB_TOKEN = process.env.VAULT_AUTH_GITHUB_TOKEN || undefined

jest.mock('@financial-times/n-fetch')

const mockedFetch = jest.mocked(fetch, true)

jest.mock('path', () => {
  return {
    join: jest.fn(() => '.vault-token')
  }
})

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(),
    readFile: jest.fn(() => {
      if (process.env.VAULT_AUTH_GITHUB_TOKEN === 'hij') {
        throw new Error('file not found')
      } else {
        return 'zzz'
      }
    })
  }
}))

const vault = new VaultEnvVars(logger, {
  environment: 'development',
  vaultPath: {
    app: 'test-app',
    team: 'test-team'
  }
})

describe(`local vault token retrieval`, () => {
  beforeAll(() => {
    delete process.env.CIRCLECI
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    if (CIRCLECI) {
      process.env.CIRCLECI = CIRCLECI
    }
    process.env.VAULT_AUTH_GITHUB_TOKEN = VAULT_AUTH_GITHUB_TOKEN
  })

  it('should handle a .vault-token file being present but expired', async () => {
    mockedFetch.mockImplementationOnce(async () => Promise.reject())
    mockedFetch.mockImplementationOnce(async () => Promise.resolve({ auth: { client_token: 'aaa' } }))
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'abc'
    const token = await vault['getAuthToken']()

    expect(fs.promises.readFile).toBeCalledTimes(1)
    expect(mockedFetch).toBeCalledTimes(2)
    expect(token).toEqual('aaa')
  })

  it('should retrieve an in-date token from .vault-token if present', async () => {
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'def'
    mockedFetch.mockImplementationOnce(async () => Promise.resolve())
    const token = await vault['getAuthToken']()

    expect(fs.promises.readFile).toBeCalledTimes(1)
    expect(mockedFetch).toBeCalledTimes(1)
    expect(token).toEqual('zzz')
  })

  it('if no file found, it should retreive a token from vault when a github token env var is present', async () => {
    mockedFetch.mockResolvedValue({ auth: { client_token: 'bbb' } })
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'hij'
    const token = await vault['getAuthToken']()

    expect(fs.promises.readFile).toBeCalledTimes(1)
    expect(mockedFetch).toBeCalledTimes(1)
    expect(token).toEqual('bbb')
  })

  it('should throw if authentication is denied', async () => {
    mockedFetch.mockResolvedValue(Promise.reject())
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'hij'

    await expect(vault['getAuthToken']()).rejects.toThrow()
  })

  it('should write a new token to file', async () => {
    mockedFetch.mockImplementationOnce(async () => Promise.reject())
    mockedFetch.mockImplementationOnce(async () => ({ auth: { client_token: 'ccc' } }))
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'abc'
    const token = await vault['getAuthToken']()

    expect(fs.promises.writeFile).toBeCalledTimes(1)
    expect(token).toEqual('ccc')
  })
})
