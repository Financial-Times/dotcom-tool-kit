import { describe, it, expect, jest } from '@jest/globals'
import Staging from '../../src/tasks/staging'
import { getPipelineCouplings } from '../../src/getPipelineCouplings'
import { getHerokuStagingApp } from '../../src/getHerokuStagingApp'
import { scaleDyno } from '../../src/scaleDyno'
import { setStagingSlug } from '../../src/setStagingSlug'
import { repeatedCheckForBuildSuccess } from '../../src/repeatedCheckForBuildSuccess'
import { gtg } from '../../src/gtg'
import winston, { Logger } from 'winston'
import { createBuild } from '../../src/createBuild'

const logger = winston as unknown as Logger

const pipeline = 'test-pipeline'
const appName = 'test-appName'
const buildInfo = {
  id: 'build-id',
  slug: null,
  status: 'notfinished'
}
const slugId = 'test-slug-id'

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

jest.mock('../../src/createBuild', () => {
  return {
    createBuild: jest.fn(() => buildInfo)
  }
})

jest.mock('../../src/repeatedCheckForBuildSuccess', () => {
  return {
    repeatedCheckForBuildSuccess: jest.fn(() => slugId)
  }
})

jest.mock('../../src/setStagingSlug', () => {
  return {
    setStagingSlug: jest.fn()
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
  beforeEach(() => {
    buildInfo.slug = null
  })

  it('should call pipeline couplings with pipeline option', async () => {
    const task = new Staging(logger, 'HerokuStaging', { pipeline }, { scaling: {} })

    await task.run()

    expect(getPipelineCouplings).toHaveBeenCalledTimes(1)
    expect(getPipelineCouplings).toHaveBeenCalledWith(expect.anything(), pipeline)
  })

  it('should return appName from get heroku staging', async () => {
    const task = new Staging(logger, 'HerokuStaging', { pipeline }, { scaling: {} })

    await task.run()

    expect(getHerokuStagingApp).toHaveBeenCalledTimes(1)
    expect(getHerokuStagingApp).toHaveReturnedWith(appName)
  })

  it('should call createBuild with app name', async () => {
    const task = new Staging(logger, 'HerokuStaging', { pipeline }, { scaling: {} })

    await task.run()

    expect(createBuild).toHaveBeenCalledWith(expect.anything(), appName)
  })

  it(`should call repeatedCheckForBuildSuccess if the slug id isn't present`, async () => {
    const task = new Staging(logger, 'HerokuStaging', { pipeline }, { scaling: {} })
    await task.run()

    expect(repeatedCheckForBuildSuccess).toHaveBeenCalledWith(expect.anything(), appName, buildInfo.id)
  })

  it('should call setStagingSlug with app name and slug id', async () => {
    const task = new Staging(logger, 'HerokuStaging', { pipeline }, { scaling: {} })
    await task.run()

    expect(setStagingSlug).toHaveBeenCalledWith(expect.anything(), appName, slugId)
  })

  it('should call scaleDyno', async () => {
    const task = new Staging(logger, 'HerokuStaging', { pipeline }, { scaling: {} })

    await task.run()

    expect(scaleDyno).toHaveBeenCalledTimes(1)
  })

  it('should call gtg with appName', async () => {
    const task = new Staging(logger, 'HerokuStaging', { pipeline }, { scaling: {} })

    await task.run()

    expect(gtg).toHaveBeenCalledWith(expect.anything(), appName, 'staging')
  })

  it('should resolve successfully when complete', async () => {
    const task = new Staging(logger, 'HerokuStaging', { pipeline }, { scaling: {} })

    await expect(task.run()).resolves.not.toThrow()
  })
})
