import { describe, it, expect, jest } from '@jest/globals'
import { scaleDyno } from '../src/scaleDyno'
import heroku from '../src/herokuClient'

const appName = 'test-staging-app-name'

const response = [
  {
    quantity: 1,
    type: 'web'
  }
]

jest.mock('../src/herokuClient', () => {
  return {
    patch: jest.fn((path: string) => {
      if (!path.includes('test-staging-app-name')) {
        throw new Error()
      }
      return response
    })
  }
})

describe('scaleDyno', () => {
  it('makes an api call to heroku with the app name', async () => {
    await scaleDyno(appName, 1)

    expect(heroku.patch).toHaveBeenCalledTimes(1)
    expect(heroku.patch).toHaveBeenCalledWith('/apps/test-staging-app-name/formation', expect.anything())
  })

  it('throws an error if scaling fails', async () => {
    await expect(scaleDyno('incorrect-app-name', 1)).rejects.toThrow()
  })

  it('resolves succesfully if scaling completes', async () => {
    await expect(scaleDyno(appName, 1)).resolves.not.toThrow()
  })
})
