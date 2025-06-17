import { describe, it, expect, jest } from '@jest/globals'
import Review from '../../src/tasks/review'
import { getHerokuReviewApp } from '../../src/getHerokuReviewApp'
import { gtg } from '../../src/gtg'
import heroku from '../../src/herokuClient'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

type State = {
  [key: string]: string
}

const state: State = {}

let pipeline = 'test-pipeline'
const appId = 'test-review-app-id'

jest.mock('../../src/herokuClient', () => {
  const originalModule = jest.requireActual('../../src/herokuClient') as object
  return {
    __esmodule: true,
    ...originalModule,
    get: jest.fn((path: string) => {
      if (path.includes('test-pipeline')) {
        return Promise.resolve({ id: 'test-pipeline-id' })
      } else {
        return Promise.reject()
      }
    })
  }
})

jest.mock('../../src/getHerokuReviewApp', () => {
  return {
    getHerokuReviewApp: jest.fn(() => 'test-review-app-id')
  }
})

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    writeState: jest.fn((environment: string, { appId }) => {
      state[environment] = appId
    })
  }
})

jest.mock('../../src/gtg', () => {
  return {
    gtg: jest.fn()
  }
})

describe('review', () => {
  it('should call pass in the pipeline id to heroku api call', async () => {
    const task = new Review(logger, 'HerokuReview', { pipeline }, { scaling: {} })

    await task.run()

    expect(heroku.get).toHaveBeenCalledTimes(1)
    expect(heroku.get).toHaveBeenCalledWith(`/pipelines/${pipeline}`)
  })

  it('should return review app id from get heroku review app', async () => {
    const task = new Review(logger, 'HerokuReview', { pipeline }, { scaling: {} })

    await task.run()

    expect(getHerokuReviewApp).toHaveBeenCalledTimes(1)
    expect(getHerokuReviewApp).toHaveBeenCalledWith(expect.anything(), 'test-pipeline-id')
  })

  it('should fail if either doppler option is missing', async () => {
    let task = new Review(logger, 'HerokuReview', { pipeline }, { scaling: {} })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }

    task = new Review(logger, 'HerokuReview', { pipeline }, { scaling: {} })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('should write app id to state', async () => {
    const task = new Review(logger, 'HerokuReview', { pipeline }, { scaling: {} })

    await task.run()

    expect(state.review).toEqual(appId)
  })

  it('should call gtg with appName', async () => {
    const task = new Review(logger, 'HerokuReview', { pipeline }, { scaling: {} })

    await task.run()

    expect(gtg).toHaveBeenCalledWith(expect.anything(), appId, 'review')
  })

  it('should throw an error if it fails', async () => {
    pipeline = 'wrong-pipeline-name'
    const task = new Review(logger, 'HerokuReview', { pipeline }, { scaling: {} })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})
