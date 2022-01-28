import { describe, it, expect, jest } from '@jest/globals'
import { getHerokuReviewApp } from '../src/getHerokuReviewApp'
import { repeatedCheckForSuccessStatus } from '../src/repeatedCheckForSuccessStatus'
import heroku from '../src/herokuClient'
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
  return {
    get: jest.fn(() => reviewApps)
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

  it('errors if there is no review app for the branch', async () => {
    branch = 'wrong-branch'

    await expect(getHerokuReviewApp(logger, pipelineId)).rejects.toThrowError()
  })
})
