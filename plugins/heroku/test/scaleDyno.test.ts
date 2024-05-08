import { describe, it, expect, jest } from '@jest/globals'
import { scaleDyno } from '../src/scaleDyno.js'
import heroku from '../src/herokuClient.js'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

const appName = 'test-staging-app-name'

const response = [
  {
    quantity: 1,
    type: 'web'
  }
]

jest.mock('../src/herokuClient', () => {
  const originalModule = jest.requireActual('../src/herokuClient') as object
  return {
    __esmodule: true,
    ...originalModule,
    patch: jest.fn(async (path: string) => {
      if (!path.includes('test-staging-app-name')) {
        throw new Error()
      }
      return response
    })
  }
})

describe('scaleDyno', () => {
  it('makes an api call to heroku with the app name', async () => {
    await scaleDyno(logger, appName, 1)

    expect(heroku.patch).toHaveBeenCalledTimes(1)
    expect(heroku.patch).toHaveBeenCalledWith('/apps/test-staging-app-name/formation', expect.anything())
  })

  it('throws an error if scaling fails', async () => {
    await expect(scaleDyno(logger, 'incorrect-app-name', 1)).rejects.toThrow()
  })

  it('resolves succesfully if scaling completes', async () => {
    await expect(scaleDyno(logger, appName, 1)).resolves.not.toThrow()
  })
})
