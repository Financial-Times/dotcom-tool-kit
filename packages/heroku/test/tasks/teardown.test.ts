import { describe, it, expect, jest } from '@jest/globals'
import Teardown from '../../src/tasks/teardown'
import * as utils from '../../src/scaleDyno'

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
    const task = new Teardown({})
    await task.run()

    expect(utils.scaleDyno).toHaveBeenCalledWith(appName, 0)
  })

  it('should resolve if succesfully completed', async () => {
    mockScaleDyno.mockImplementationOnce(() => Promise.resolve())
    const task = new Teardown({})
    await expect(task.run()).resolves.not.toThrow()
  })

  it('should throw if it completes unsuccessfully', async () => {
    mockScaleDyno.mockImplementationOnce(() => Promise.reject())
    const task = new Teardown({})
    await expect(task.run()).rejects.not.toThrow()
  })
})
