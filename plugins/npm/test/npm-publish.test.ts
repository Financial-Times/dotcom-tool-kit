import { writeFile } from 'fs/promises'

import winston, { type Logger } from 'winston'
import pacote, { type ManifestResult } from 'pacote'
import { publish } from 'libnpmpublish'
import pack from 'libnpmpack'

import * as state from '@dotcom-tool-kit/state'

import NpmPublish from '../src/tasks/publish'

const logger = winston as unknown as Logger

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

    const task = new NpmPublish(logger, 'NpmPublish', {})
    await expect(async () => {
      await task.run()
    }).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Could not find state for ci, check that you are running this task on circleci"`
    )
  })

  it('should throw error if tag is not found', async () => {
    readStateMock.mockReturnValue({ tag: '', repo: '', branch: '', version: '' })

    const task = new NpmPublish(logger, 'NpmPublish', {})
    await expect(async () => {
      await task.run()
    }).rejects.toThrowErrorMatchingInlineSnapshot(
      `"No \`tag\` variable found in the Tool Kit \`ci\` state. Make sure this task is running on a CI tag branch."`
    )
  })

  it('should return prerelease if match prerelease regex in getNpmTag', () => {
    const task = new NpmPublish(logger, 'NpmPublish', {})
    expect(task.getNpmTag('v1.6.0-beta.1')).toEqual('prerelease')
  })

  it('should return latest if match latest regex in getNpmTag', () => {
    const task = new NpmPublish(logger, 'NpmPublish', {})
    expect(task.getNpmTag('v1.6.0')).toEqual('latest')
  })

  it('should throw error if tag does not match semver regex', async () => {
    readStateMock.mockReturnValue({ tag: 'random-branch', repo: '', branch: '', version: '' })

    const task = new NpmPublish(logger, 'NpmPublish', {})
    await expect(async () => {
      await task.run()
    }).rejects.toThrowErrorMatchingInlineSnapshot(
      `"The Tool Kit \`ci\` state \`tag\` variable random-branch does not match regex /^v\\\\d+\\\\.\\\\d+\\\\.\\\\d+(-.+)?/. Configure your release version to match the regex eg. v1.2.3-beta.8"`
    )
  })

  it('should call listPackedFiles, pack and publish if tag matches semver regex', async () => {
    process.env.NPM_AUTH_TOKEN = process.env.NPM_AUTH_TOKEN || 'dummy_value'
    readStateMock.mockReturnValue({ tag: 'v1.2.3-beta.2', repo: '', branch: '', version: '' })
    const listPackedFilesSpy = jest.spyOn(NpmPublish.prototype, 'listPackedFiles')
    listPackedFilesSpy.mockImplementation(() => Promise.resolve())

    const task = new NpmPublish(logger, 'NpmPublish', {})
    await task.run()

    expect(listPackedFilesSpy).toBeCalled()
    expect(pack).toBeCalled()
    expect(publish).toBeCalled()
  })

  it('should write the version tag to the package.json file', async () => {
    const MOCK_CIRCLE_TAG = 'v1.2.3-beta.2'
    process.env.NPM_AUTH_TOKEN = process.env.NPM_AUTH_TOKEN || 'dummy_value'
    readStateMock.mockReturnValue({ tag: MOCK_CIRCLE_TAG, repo: '', branch: '', version: '' })

    const task = new NpmPublish(logger, 'NpmPublish', {})
    await task.run()

    expect(writeFile).toHaveBeenCalledWith(
      'package.json',
      expect.stringContaining(`${MOCK_CIRCLE_TAG.replace(/^v/, '')}`)
    )
    expect(publish).toBeCalled()
  })
})
