import { describe, it, expect, jest } from '@jest/globals'
import { promoteStagingToProduction } from '../src/promoteStagingToProduction'
import heroku from '../src/herokuClient'
import { gtg } from '../src/gtg'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

const slugId = 'slug-id'
const appIds = ['app-id-1', 'app-id-2']
const goodHerokuResponse = [
  { id: 'id-1', app: { id: 'app-id-1', name: 'app-name-1' } },
  { id: 'id-2', app: { id: 'app-id-2', name: 'app-name-2' } }
]

const mockHerokuPost = jest.spyOn(heroku, 'post')

jest.mock('../src/gtg', () => {
  return {
    gtg: jest.fn()
  }
})

jest.mock('@dotcom-tool-kit/state', () => {
  return {
    readState: jest.fn(() => ({ appIds }))
  }
})

describe('promoteStagingToProduction', () => {
  it('calls heroku api for each app', async () => {
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[0]))
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))
    await promoteStagingToProduction(logger, slugId)

    expect(heroku.post).toHaveBeenCalledTimes(2)
  })

  it('calls heroku api with different app ids for each app', async () => {
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[0]))
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))
    await promoteStagingToProduction(logger, slugId)

    expect(heroku.post).toHaveBeenNthCalledWith(1, `/apps/${appIds[0]}/releases`, {
      body: { slug: 'slug-id' }
    })
    expect(heroku.post).toHaveBeenNthCalledWith(2, `/apps/${appIds[1]}/releases`, {
      body: { slug: 'slug-id' }
    })
  })

  it('calls gtg for each app', async () => {
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[0]))
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))
    await promoteStagingToProduction(logger, slugId)

    expect(gtg).toHaveBeenNthCalledWith(1, logger, 'app-name-1', 'production')
    expect(gtg).toHaveBeenNthCalledWith(2, logger, 'app-name-2', 'production')
  })

  it('completes successfully when function completes', async () => {
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[0]))
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))

    await expect(promoteStagingToProduction(logger, slugId)).resolves.not.toThrow()
  })

  it('throws when unsuccessful', async () => {
    mockHerokuPost.mockImplementationOnce(async () => Promise.reject())
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))

    await expect(promoteStagingToProduction(logger, slugId)).rejects.toThrow()

    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))
    mockHerokuPost.mockImplementationOnce(async () => Promise.reject())

    await expect(promoteStagingToProduction(logger, slugId)).rejects.toThrow()
  })
})
