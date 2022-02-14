import { describe, it, expect, jest } from '@jest/globals'
import Staging from '../../src/tasks/staging'
import { getPipelineCouplings } from '../../src/getPipelineCouplings'
import { getHerokuStagingApp } from '../../src/getHerokuStagingApp'
import { setConfigVars } from '../../src/setConfigVars'
import { scaleDyno } from '../../src/scaleDyno'
import { gtg } from '../../src/gtg'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

const pipeline = 'test-pipeline'
const appName = 'test-appName'
const systemCode = 'test-systemCode'

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
  it('should fail when pipeline or system code option is missing', async () => {
    const task = new Staging(logger, {})

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('should call pipeline couplings with pipeline option', async () => {
    const task = new Staging(logger, { pipeline, systemCode })

    await task.run()

    expect(getPipelineCouplings).toBeCalledTimes(1)
    expect(getPipelineCouplings).toBeCalledWith(expect.anything(), pipeline)
  })

  it('should return appName from get heroku staging', async () => {
    const task = new Staging(logger, { pipeline, systemCode })

    await task.run()

    expect(getHerokuStagingApp).toBeCalledTimes(1)
    expect(getHerokuStagingApp).toReturnWith(appName)
  })

  it('should fail if either vault option is missing', async () => {
    let task = new Staging(logger, { pipeline })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }

    task = new Staging(logger, { pipeline, systemCode })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })

  it('should call setConfigVars with vault team, vault app and system code', async () => {
    const task = new Staging(logger, { pipeline, systemCode })

    await task.run()

    expect(setConfigVars).toBeCalledWith(expect.anything(), appName, 'production', systemCode)
  })

  it('should call scaleDyno', async () => {
    const task = new Staging(logger, { pipeline, systemCode })

    await task.run()

    expect(scaleDyno).toBeCalledTimes(1)
  })

  it('should call gtg with appName', async () => {
    const task = new Staging(logger, { pipeline, systemCode })

    await task.run()

    expect(gtg).toBeCalledWith(expect.anything(), appName, 'staging', false)
  })

  it('should throw an error if it fails', async () => {
    const task = new Staging(logger, { pipeline })

    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})
