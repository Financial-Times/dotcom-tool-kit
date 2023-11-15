import { describe, it, expect, jest } from '@jest/globals'
import Production from '../../src/tasks/production'
import * as utils from '../../src/promoteStagingToProduction'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    readState: jest.fn(() => ({ slugId: 'slug-id' }))
  }
})

jest.mock('../../src/scaleDyno')
const mockPromoteStagingToProduction = jest.spyOn(utils, 'promoteStagingToProduction')
jest.spyOn(Production.prototype, 'fetchIfAppHasDeployed').mockImplementation(() => Promise.resolve(true))

const productionOptions = {
  pipeline: 'next-health',
  systemCode: 'next-health',
  scaling: { 'test-app': { web: { size: 'standard-1x', quantity: 1 } } }
}

describe('staging', () => {
  it('should call set slug with slug id and system code', async () => {
    mockPromoteStagingToProduction.mockImplementation(() => Promise.resolve([]))
    const task = new Production(logger, 'HerokuProduction', productionOptions)
    await task.run()

    expect(utils.promoteStagingToProduction).toBeCalledWith(expect.anything(), 'slug-id', 'next-health')
  })

  it('should resolve when completed successfully', async () => {
    const task = new Production(logger, 'HerokuProduction', productionOptions)
    await expect(task.run()).resolves.not.toThrow()
  })

  it('should throw if it completes unsuccessfully', async () => {
    mockPromoteStagingToProduction.mockImplementation(() => Promise.reject())
    const task = new Production(logger, 'HerokuProduction', productionOptions)
    await expect(task.run()).rejects.toThrowError()
  })
})
