import { describe, expect, it, jest } from '@jest/globals'
import winston, { type Logger } from 'winston'

import { setStagingSlug } from '../src/setStagingSlug'
import heroku from '../src/herokuClient'

const logger = winston as unknown as Logger
const mockHerokuPost = jest.spyOn(heroku, 'post')
const appName = 'test-app-name'
const slug = 'test-slug-id'

describe('setStagingSlug', () => {
  it('posts to heroku api with app name and slug id', async () => {
    mockHerokuPost.mockImplementation(async () => Promise.resolve({ slug: { id: 'test-slug-id' } }))

    await setStagingSlug(logger, appName, slug)

    expect(heroku.post).toBeCalledWith(`/apps/${appName}/releases`, { body: { slug } })
  })

  it('throws an error if unsuccessful', async () => {
    mockHerokuPost.mockImplementation(async () => Promise.reject())

    await expect(setStagingSlug(logger, appName, slug)).rejects.toThrowError()
  })

  it('resolves if successful', async () => {
    mockHerokuPost.mockImplementation(async () => Promise.resolve({ slug: { id: 'test-slug-id' } }))

    await expect(setStagingSlug(logger, appName, slug)).resolves.not.toThrow()
  })
})
