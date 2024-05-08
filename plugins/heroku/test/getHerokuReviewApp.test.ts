import { describe, it, expect, jest } from '@jest/globals'
import { getHerokuReviewApp } from '../src/getHerokuReviewApp.js'
import { repeatedCheckForSuccessStatus } from '../src/repeatedCheckForSuccessStatus.js'
import heroku from '../src/herokuClient.js'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

const pipelineId = 'pipeline-id'

let branch = 'test-branch'

const reviewApps = [
  {
    id: 'test-id',
    branch: 'test-branch',
    status: 'creating',
    app: {
      id: 'test-app-id'
    }
  },
  {
    id: 'test-id-1',
    branch: 'test-branch-1',
    status: 'created',
    app: {
      id: 'test-app-id-1'
    }
  }
]

jest.mock('../src/herokuClient', () => {
  const originalModule = jest.requireActual('../src/herokuClient') as object
  return {
    __esmodule: true,
    ...originalModule,
    get: jest.fn(async () => reviewApps)
  }
})

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    readState: jest.fn(() => ({ branch }))
  }
})

jest.mock('../src/repeatedCheckForSuccessStatus', () => {
  return {
    repeatedCheckForSuccessStatus: jest.fn()
  }
})

describe('getHerokuReviewApp', () => {
  it('gets calls heroku api with its pipeline id', async () => {
    await getHerokuReviewApp(logger, pipelineId)

    expect(heroku.get).toBeCalledTimes(1)
    expect(heroku.get).toBeCalledWith(`/pipelines/${pipelineId}/review-apps`)
  })

  it('checks for success if the review app is creating', async () => {
    await getHerokuReviewApp(logger, pipelineId)

    expect(repeatedCheckForSuccessStatus).toBeCalledTimes(1)
  })

  it(`doesn't check for success if the review app has been created`, async () => {
    reviewApps[0].status = 'created'

    await getHerokuReviewApp(logger, pipelineId)

    expect(repeatedCheckForSuccessStatus).toBeCalledTimes(0)
  })

  it('returns the review app id if successful', async () => {
    const reviewAppId = await getHerokuReviewApp(logger, pipelineId)

    expect(reviewAppId).toEqual('test-app-id')
  })

  it('returns an undefined review app id if unsuccessful ', async () => {
    branch = 'wrong-branch'

    const reviewAppId = await getHerokuReviewApp(logger, pipelineId)

    expect(reviewAppId).toEqual(undefined)
  })
})
