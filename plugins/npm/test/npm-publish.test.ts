import { semVerRegex } from '@dotcom-tool-kit/types/lib/npm'
import NpmPublish from '../src/tasks/npm-publish'
import winston, { Logger } from 'winston'
import { ToolKitError } from '../../../lib/error/lib'
import * as state from '@dotcom-tool-kit/state'
import { waitOnExit } from '@dotcom-tool-kit/logger'
import { spawn } from 'node:child_process'

const logger = (winston as unknown) as Logger

const readStateMock = jest.spyOn(state, 'readState')
jest.mock('node:child_process')
jest.mock('@dotcom-tool-kit/logger')

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

  it('should call exec to run npm version and npm publish if tag matches semver regex', async () => {
    process.env.NPM_AUTH_TOKEN = process.env.NPM_AUTH_TOKEN || 'MOCK_NPM_AUTH_TOKEN'
    const tag = 'v1.2.3-beta.2'
    readStateMock.mockReturnValue({ tag: tag, repo: '', branch: '', version: '' })

    const task = new NpmPublish(logger, {})
    await task.run()

    expect(spawn).toHaveBeenNthCalledWith(1, 'npm', ['version', tag, '--no-git-tag-version'])
    expect(spawn).toHaveBeenNthCalledWith(2, 'npm', ['publish', '--tag', 'prerelease'])
    expect(waitOnExit).toHaveBeenCalledTimes(2)
  })
})
