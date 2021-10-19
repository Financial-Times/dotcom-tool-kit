import { describe, it, expect, jest } from '@jest/globals'
import Review from '../../src/tasks/review'
import { getHerokuReviewApp } from '../../src/getHerokuReviewApp'
import { setConfigVars } from '../../src/setConfigVars'
import { gtg } from '../../src/gtg'
import heroku from '../../src/herokuClient'

type State = {
  [key: string]: string
}

const state: State = {}

let pipeline = 'test-pipeline'
const vaultTeam = 'test-vaultTeam'
const vaultApp = 'test-vaultApp'
const appId = 'test-review-app-id'

jest.mock('../../src/herokuClient', () => {
  return {
    get: jest.fn((path: string) => {
      if (path.includes('test-pipeline')) {
        return { id: 'test-pipeline-id' }
      } else {
        Promise.reject()
      }
    })
  }
})

jest.mock('../../src/getHerokuReviewApp', () => {
  return {
    getHerokuReviewApp: jest.fn(() => 'test-review-app-id')
  }
})

jest.mock('../../src/setConfigVars', () => {
  return {
    setConfigVars: jest.fn()
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
  it('should fail when pipeline option is missing', async () => {
    const task = new Review({})

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('should call pass in the pipeline id to heroku api call', async () => {
    const task = new Review({ pipeline, vaultApp, vaultTeam })

    await task.run()

    expect(heroku.get).toBeCalledTimes(1)
    expect(heroku.get).toBeCalledWith(`/pipelines/${pipeline}`)
  })

  it('should return appName from get heroku staging', async () => {
    const task = new Review({ pipeline, vaultApp, vaultTeam })

    await task.run()

    expect(getHerokuReviewApp).toBeCalledTimes(1)
    expect(getHerokuReviewApp).toBeCalledWith('test-pipeline-id')
  })

  it('should fail if either vault option is missing', async () => {
    let task = new Review({ pipeline, vaultApp })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }

    task = new Review({ pipeline, vaultTeam })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('should write app id to state', async () => {
    const task = new Review({ pipeline, vaultApp, vaultTeam })

    await task.run()

    expect(state.review).toEqual(appId)
  })

  it('should call setConfigVars with vault team and vault app', async () => {
    const task = new Review({ pipeline, vaultApp, vaultTeam })

    await task.run()

    expect(setConfigVars).toBeCalledWith(appId, 'continuous-integration', { team: vaultTeam, app: vaultApp })
  })

  it('should call gtg with appName', async () => {
    const task = new Review({ pipeline, vaultApp, vaultTeam })

    await task.run()

    expect(gtg).toBeCalledWith(appId, 'review')
  })

  it('should throw an error if it fails', async () => {
    pipeline = 'wrong-pipeline-name'
    const task = new Review({ pipeline, vaultApp, vaultTeam })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})
