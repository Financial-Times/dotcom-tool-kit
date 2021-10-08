import { describe, it, expect, jest } from '@jest/globals'
import Staging from '../../src/tasks/staging'
import { getPipelineCouplings } from '../../src/getPipelineCouplings'
import { getHerokuStagingApp } from '../../src/getHerokuStagingApp'
import { setConfigVars } from '../../src/setConfigVars'
import { scaleDyno } from '../../src/scaleDyno'
import { gtg } from '../../src/gtg'

const pipeline = 'test-pipeline'
const vaultTeam = 'test-vaultTeam'
const vaultApp = 'test-vaultApp'
const appName = 'test-appName'

jest.mock('../../src/getPipelineCouplings', () => {
  return {
    getPipelineCouplings: jest.fn()
  }
})

jest.mock('../../src/getHerokuStagingApp', () => {
  return {
    getHerokuStagingApp: jest.fn(() => 'test-appName')
  }
})

jest.mock('../../src/setConfigVars', () => {
  return {
    setConfigVars: jest.fn(() => false)
  }
})

jest.mock('../../src/scaleDyno', () => {
  return {
    scaleDyno: jest.fn(() => false)
  }
})

jest.mock('../../src/gtg', () => {
  return {
    gtg: jest.fn()
  }
})

describe('staging', () => {
  it('should fail when pipeline option is missing', async () => {
    const task = new Staging({})

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('should call pipeline couplings with pipeline option', async () => {
    const task = new Staging({ pipeline })

    try {
      await task.run()
    } catch {}

    expect(getPipelineCouplings).toBeCalledTimes(1)
    expect(getPipelineCouplings).toBeCalledWith(pipeline)
  })

  it('should return appName from get heroku staging', async () => {
    const task = new Staging({ pipeline })

    try {
      await task.run()
    } catch {}

    expect(getHerokuStagingApp).toBeCalledTimes(1)
    expect(getHerokuStagingApp).toReturnWith(appName)
  })

  it('should fail if either vault option is missing', async () => {
    let task = new Staging({ pipeline, vaultApp })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }

    task = new Staging({ pipeline, vaultTeam })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('should call setConfigVars with vault team and vault app', async () => {
    const task = new Staging({ pipeline, vaultApp, vaultTeam })

    try {
      await task.run()
    } catch {}

    expect(setConfigVars).toBeCalledWith(appName, 'production', { team: vaultTeam, app: vaultApp })
  })

  it('should call scaleDyno', async () => {
    const task = new Staging({ pipeline, vaultApp, vaultTeam })

    try {
      await task.run()
    } catch {}

    expect(scaleDyno).toBeCalledTimes(1)
  })

  it('should call gtg with appName', async () => {
    const task = new Staging({ pipeline, vaultApp, vaultTeam })

    try {
      await task.run()
    } catch {}

    expect(gtg).toBeCalledWith(appName, 'staging', false)
  })

  it('should throw an error if it fails', async () => {
    const task = new Staging({ pipeline, vaultApp, vaultTeam })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})
