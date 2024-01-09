import { describe, expect, it, jest } from '@jest/globals'
import winston, { type Logger } from 'winston'

import { repeatedCheckForBuildSuccess } from '../src/repeatedCheckForBuildSuccess'
import heroku from '../src/herokuClient'

const logger = winston as unknown as Logger

const appName = 'test-app-name'
const buildId = 'test-build-id'

const buildInfo = {
  id: 'test-build-id',
  status: 'succeeded',
  slug: {
    id: 'test-slug-id'
  }
}

const mockHerokuGet = jest.spyOn(heroku, 'get')

describe('repeatedCheckForBuildSuccess', () => {
  it('calls heroku api with the app name', async () => {
    mockHerokuGet.mockImplementationOnce(async () => Promise.resolve(buildInfo))

    await repeatedCheckForBuildSuccess(logger, appName, buildId)

    expect(heroku.get).toHaveBeenCalledWith(`/apps/${appName}/builds/${buildId}`)
  })

  it('throws an error if unsuccessful', async () => {
    mockHerokuGet.mockImplementationOnce(async () => Promise.reject())

    await expect(repeatedCheckForBuildSuccess(logger, appName, buildId)).rejects.toThrowError()
  })

  it('returns slug id if the build is successful', async () => {
    mockHerokuGet.mockImplementationOnce(async () => Promise.resolve(buildInfo))

    await expect(repeatedCheckForBuildSuccess(logger, appName, buildId)).resolves.toEqual(buildInfo.slug.id)
  })
})
