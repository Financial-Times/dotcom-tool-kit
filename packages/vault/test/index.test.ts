import { describe, it, beforeAll, beforeEach, afterAll, jest, expect } from '@jest/globals'
import { VaultEnvVars } from '../src/index'
import fetch from '@financial-times/n-fetch'
import { mocked } from 'ts-jest/utils'
import fs from 'fs'
process.env.CIRCLECI = 'true'
console.log('SET FROM CLI', process.env.CIRCLECI)
let CIRCLECI: string
if (process.env.CIRCLECI) {
  CIRCLECI = process.env.CIRCLECI
}
const VAULT_AUTH_GITHUB_TOKEN = process.env.VAULT_AUTH_GITHUB_TOKEN || undefined

const expiredBirthtime = new Date(new Date().getTime() - 48 * 60 * 60 * 1000)
const activeBirthtime = new Date(new Date().getTime() - 2 * 60 * 60 * 1000)

jest.mock('@financial-times/n-fetch')

const mockedFetch = mocked(fetch, true)

jest.mock('path', () => {
  return {
    join: jest.fn(() => '.vault-token')
  }
})

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(),
    stat: jest.fn(() => {
      console.log('token', process.env.VAULT_AUTH_GITHUB_TOKEN)
      if (process.env.VAULT_AUTH_GITHUB_TOKEN === 'abc') {
        return { birthtime: expiredBirthtime }
      } else if (process.env.VAULT_AUTH_GITHUB_TOKEN === 'def') {
        return { birthtime: activeBirthtime }
      } else {
        throw new Error()
      }
    }),
    readFile: jest.fn(() => 'zzz')
  }
}))

const vault = new VaultEnvVars({
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
    console.log('after all', process.env.CIRCLECI, typeof process.env.CIRCLECI)
  })

  it('should handle a .vault-token file being present but expired', async () => {
    mockedFetch.mockResolvedValue({ auth: { client_token: 'aaa' } })
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'abc'
    const token = await vault['getAuthToken']()

    expect(fs.promises.readFile).toBeCalledTimes(0)
    expect(mockedFetch).toBeCalledTimes(1)
    expect(token).toEqual('aaa')
  })

  it('should retrieve an in-date token from .vault-token if present', async () => {
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'def'
    const token = await vault['getAuthToken']()

    expect(fs.promises.readFile).toBeCalledTimes(1)
    expect(mockedFetch).toBeCalledTimes(0)
    expect(token).toEqual('zzz')
  })

  it('if no file found, it should retreive a token from vault when a github token env var is present', async () => {
    mockedFetch.mockResolvedValue({ auth: { client_token: 'bbb' } })
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'hij'
    const token = await vault['getAuthToken']()

    expect(fs.promises.readFile).toBeCalledTimes(0)
    expect(mockedFetch).toBeCalledTimes(1)
    expect(token).toEqual('bbb')
  })

  it('should throw if authentication is denied', async () => {
    mockedFetch.mockRejectedValue(undefined)
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'hij'
    await expect(vault['getAuthToken']()).rejects.toThrow()
  })

  it('should write a new token to file', async () => {
    mockedFetch.mockResolvedValue({ auth: { client_token: 'ccc' } })
    process.env.VAULT_AUTH_GITHUB_TOKEN = 'abc'
    const token = await vault['getAuthToken']()

    expect(fs.promises.writeFile).toBeCalledTimes(1)
    expect(token).toEqual('ccc')
  })
})
