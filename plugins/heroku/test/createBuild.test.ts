import { describe, it, expect, jest } from '@jest/globals'
import { createBuild } from '../src/createBuild'
import { getRepoDetails } from '../src/githubApi'
import heroku from '../src/herokuClient'
import winston, { Logger } from 'winston'


const logger = (winston as unknown) as Logger

const appName = 'test-app-name'

const repo = {
	branch: 'test-branch',
	source_blob: {
		url: 'test-url',
		version: 'test-version'
	}
}

const buildInfo = {
	id: 'test-build-id',
    status: 'notfinished',
    slug: null
}

const mockHerokuPost = jest.spyOn(heroku, 'post')

jest.mock('../src/githubApi', () => {
	return {
		getRepoDetails: jest.fn(() => (repo))
  }})

describe('setStagingSlug', () => {

	it('retrieves repo details', async () => {
		mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(buildInfo))
		await createBuild(logger, appName)

		expect(getRepoDetails).toBeCalledTimes(1)
		expect(getRepoDetails).toBeCalledWith(logger)
	})

	it('creates a new build for the app', async () => {
		mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(buildInfo))
		await createBuild(logger, appName)

		expect(heroku.post).toBeCalledTimes(1)
		expect(heroku.post).toBeCalledWith(`/apps/${appName}/builds`, {body: {source_blob: {...repo.source_blob, checksum:null}}})
	})

	it('returns build info if successful', async () => {
		mockHerokuPost.mockImplementationOnce(async () => Promise.resolve(buildInfo))

		await expect(createBuild(logger, appName)).resolves.not.toThrow()
	})

	it('throws if unsuccessful', async () => {
		mockHerokuPost.mockImplementationOnce(async () => Promise.reject())

		await expect(createBuild(logger, appName)).rejects.toThrow()
	})
})