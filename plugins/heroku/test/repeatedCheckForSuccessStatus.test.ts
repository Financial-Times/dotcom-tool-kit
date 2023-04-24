import { describe, it, expect, jest } from '@jest/globals'
import { repeatedCheckForSuccessStatus } from '../src/repeatedCheckForSuccessStatus'
import heroku from '../src/herokuClient'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

const reviewAppId = 'review-app-id'

const reviewApp = {
  id: 'test-id',
  branch: 'test-branch',
  status: 'created',
  app: {
    id: reviewAppId
  }
}

jest.mock('../src/herokuClient', () => {
  const originalModule = jest.requireActual('../src/herokuClient') as object
  return {
    __esmodule: true,
    ...originalModule,
    get: jest.fn(async () => reviewApp)
  }
})

describe('repeatedCheckForSuccessStatus', () => {
  it('calls heroku api with the review app id', async () => {
    await repeatedCheckForSuccessStatus(logger, reviewAppId)

    expect(heroku.get).toHaveBeenCalledWith(`/review-apps/${reviewAppId}`)
  })

  it('throws an error if the app was deleted', async () => {
    reviewApp.status = 'deleted'

    await expect(repeatedCheckForSuccessStatus(logger, reviewAppId)).rejects.toThrowError()
  })

  it('returns true if the review app is successfully polled', async () => {
    reviewApp.status = 'created'

    await expect(repeatedCheckForSuccessStatus(logger, reviewAppId)).resolves
  })
})
