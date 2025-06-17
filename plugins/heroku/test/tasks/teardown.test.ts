import { describe, it, expect, jest } from '@jest/globals'
import Teardown from '../../src/tasks/teardown'
import * as utils from '../../src/scaleDyno'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

const appName = 'staging-app-name'

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    readState: jest.fn(() => ({ appName }))
  }
})

const mockScaleDyno = jest.spyOn(utils, 'scaleDyno')

describe('teardown', () => {
  it('should call scaleDyno with app name', async () => {
    mockScaleDyno.mockImplementationOnce(() => Promise.resolve())
    const task = new Teardown(logger, 'HerokuTeardown', {})
    await task.run()

    expect(utils.scaleDyno).toHaveBeenCalledWith(expect.anything(), appName, 0)
  })

  it('should resolve if succesfully completed', async () => {
    mockScaleDyno.mockImplementationOnce(() => Promise.resolve())
    const task = new Teardown(logger, 'HerokuTeardown', {})
    await expect(task.run()).resolves.not.toThrow()
  })

  it('should return a rejected promise if it completes unsuccessfully', async () => {
    mockScaleDyno.mockImplementationOnce(() => Promise.reject())
    const task = new Teardown(logger, 'HerokuTeardown', {})
    await expect(task.run()).rejects.toThrow()
  })
})
