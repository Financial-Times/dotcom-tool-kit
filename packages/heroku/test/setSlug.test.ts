import { describe, it, expect, jest } from '@jest/globals'
import { setSlug } from '../src/setSlug'
import heroku from '../src/herokuClient'
import { gtg } from '../src/gtg'

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

describe('setSlug', () => {
  it('calls heroku api for each app', async () => {
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[0]))
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))
    await setSlug(slugId)

    expect(heroku.post).toHaveBeenCalledTimes(2)
  })

  it('calls heroku api with different app ids for each app', async () => {
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[0]))
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))
    await setSlug(slugId)

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
    await setSlug(slugId)

    expect(gtg).toHaveBeenNthCalledWith(1, 'app-name-1', 'production', false)
    expect(gtg).toHaveBeenNthCalledWith(2, 'app-name-2', 'production', false)
  })

  it('completes successfully when function completes', async () => {
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[0]))
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))

    await expect(setSlug(slugId)).resolves.not.toThrow()
  })

  it('throws when unsuccessful', async () => {
    mockHerokuPost.mockImplementationOnce(async () => Promise.reject())
    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))

    await expect(setSlug(slugId)).rejects.toThrow()

    mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(goodHerokuResponse[1]))
    mockHerokuPost.mockImplementationOnce(async () => Promise.reject())

    await expect(setSlug(slugId)).rejects.toThrow()
  })
})
