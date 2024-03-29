import { semVerRegex } from '@dotcom-tool-kit/types/lib/npm'
import NpmPublish from '../src/tasks/npm-publish'
import winston, { Logger } from 'winston'
import { ToolKitError } from '../../../lib/error/lib'
import * as state from '@dotcom-tool-kit/state'
import pacote, { ManifestResult } from 'pacote'
import { publish } from 'libnpmpublish'
import pack from 'libnpmpack'
import { writeFile } from 'fs/promises'

const logger = (winston as unknown) as Logger

const readStateMock = jest.spyOn(state, 'readState')
jest.spyOn(pacote, 'manifest').mockImplementation(() => Promise.resolve({} as ManifestResult))
jest.spyOn(process, 'cwd').mockImplementation(() => '')
jest.mock('fs/promises', () => {
  const originalModule = jest.requireActual('fs/promises')

  return {
    ...originalModule,
    writeFile: jest.fn(),
    readFile: jest.fn().mockReturnValue(JSON.stringify({ name: 'my-package', version: '0.0.1' }))
  }
})
jest.mock('libnpmpack', () => {
  return jest.fn(() => Promise.resolve())
})
jest.mock('libnpmpublish', () => {
  return {
    publish: jest.fn(() => Promise.resolve())
  }
})

describe('NpmPublish', () => {
  it('should throw an error if ci is not found in state', async () => {
    readStateMock.mockReturnValue(null)

    const task = new NpmPublish(logger, {})
    await expect(async () => {
      await task.run()
    }).rejects.toThrow(
      new ToolKitError(`Could not find state for ci, check that you are running this task on circleci`)
    )
  })

  it('should throw error if tag is not found', async () => {
    readStateMock.mockReturnValue({ tag: '', repo: '', branch: '', version: '' })

    const task = new NpmPublish(logger, {})
    await expect(async () => {
      await task.run()
    }).rejects.toThrow(
      new ToolKitError(
        'CIRCLE_TAG environment variable not found. Make sure you are running this on a release version!'
      )
    )
  })

  it('should return prerelease if match prerelease regex in getNpmTag', () => {
    const task = new NpmPublish(logger, {})
    expect(task.getNpmTag('v1.6.0-beta.1')).toEqual('prerelease')
  })

  it('should return latest if match latest regex in getNpmTag', () => {
    const task = new NpmPublish(logger, {})
    expect(task.getNpmTag('v1.6.0')).toEqual('latest')
  })

  it('should throw error if tag does not match semver regex', async () => {
    readStateMock.mockReturnValue({ tag: 'random-branch', repo: '', branch: '', version: '' })

    const task = new NpmPublish(logger, {})
    await expect(async () => {
      await task.run()
    }).rejects.toThrow(
      new ToolKitError(
        `CIRCLE_TAG does not match regex ${semVerRegex}. Configure your release version to match the regex eg. v1.2.3-beta.8`
      )
    )
  })

  it('should call listPackedFiles, pack and publish if tag matches semver regex', async () => {
    process.env.NPM_AUTH_TOKEN = process.env.NPM_AUTH_TOKEN || 'dummy_value'
    readStateMock.mockReturnValue({ tag: 'v1.2.3-beta.2', repo: '', branch: '', version: '' })
    const listPackedFilesSpy = jest.spyOn(NpmPublish.prototype, 'listPackedFiles')
    listPackedFilesSpy.mockImplementation(() => Promise.resolve())

    const task = new NpmPublish(logger, {})
    await task.run()

    expect(listPackedFilesSpy).toBeCalled()
    expect(pack).toBeCalled()
    expect(publish).toBeCalled()
  })

  it('should write the version tag to the package.json file', async () => {
    const MOCK_CIRCLE_TAG = 'v1.2.3-beta.2'
    process.env.NPM_AUTH_TOKEN = process.env.NPM_AUTH_TOKEN || 'dummy_value'
    readStateMock.mockReturnValue({ tag: MOCK_CIRCLE_TAG, repo: '', branch: '', version: '' })

    const task = new NpmPublish(logger, {})
    await task.run()

    expect(writeFile).toHaveBeenCalledWith(
      'package.json',
      expect.stringContaining(`${MOCK_CIRCLE_TAG.replace(/^v/, '')}`)
    )
    expect(publish).toBeCalled()
  })
})
