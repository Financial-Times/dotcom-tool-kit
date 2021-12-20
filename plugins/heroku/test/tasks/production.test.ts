import { describe, it, expect, jest } from '@jest/globals'
import Production from '../../src/tasks/production'
import * as utils from '../../src/setSlug'

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    readState: jest.fn(() => ({ slugId: 'slug-id' }))
  }
})

jest.mock('../../src/scaleDyno')

const mockSetSlug = jest.spyOn(utils, 'setSlug')
const productionOptions = { scaling: { 'test-app': { web: { size: 'standard-1x', quantity: 1 } } } }

describe('staging', () => {
  it('should call set slug with slug id', async () => {
    mockSetSlug.mockImplementation(() => Promise.resolve([]))
    const task = new Production(productionOptions)
    await task.run()

    expect(utils.setSlug).toBeCalledWith('slug-id')
  })

  it('should resolve when completed successfully', async () => {
    const task = new Production(productionOptions)
    await expect(task.run()).resolves.not.toThrow()
  })

  it('should throw if it completes unsuccessfully', async () => {
    mockSetSlug.mockImplementation(() => Promise.reject())
    const task = new Production(productionOptions)
    await expect(task.run()).rejects.toThrowError()
  })
})
