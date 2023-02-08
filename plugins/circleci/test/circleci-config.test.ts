import { describe, expect, it } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import winston, { Logger } from 'winston'
import * as YAML from 'yaml'
import CircleCiConfigHook, { generateConfigWithJob } from '../src/circleci-config'

const logger = (winston as unknown) as Logger

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs')

  return {
    ...originalModule,
    promises: { ...originalModule.promises, writeFile: jest.fn() }
  }
})
const mockedWriteFile = jest.mocked(fs.promises.writeFile)

describe('CircleCI config hook', () => {
  class TestHook extends CircleCiConfigHook {
    config = generateConfigWithJob({ name: 'test-job', addToNightly: true, requires: ['another-job'] })
  }
  class TestAnotherHook extends CircleCiConfigHook {
    config = generateConfigWithJob({
      name: 'test-another-job',
      addToNightly: false,
      requires: ['another-job']
    })
  }

  const originalDir = process.cwd()

  afterEach(() => {
    process.chdir(originalDir)
  })

  describe('check', () => {
    it('should return true if the hook job is in the circleci workflow', async () => {
      process.chdir(path.join(__dirname, 'files', 'with-hook'))
      const hook = new TestHook(logger)
      expect(await hook.check()).toBeTruthy()
    })

    it('should return false if the hook job is not in the circleci workflow', async () => {
      process.chdir(path.join(__dirname, 'files', 'without-hook'))
      const hook = new TestHook(logger)
      expect(await hook.check()).toBeFalsy()
    })
  })

  describe('install', () => {
    it("should throw an error explaining how to autogenerate config if existing config file doesn't contain any tool-kit jobs", async () => {
      process.chdir(path.join(__dirname, 'files', 'without-tool-kit'))
      const hook = new TestHook(logger)
      const state = await hook.install()
      await expect(hook.commitInstall(state)).rejects.toThrow(
        "Your project has an existing CircleCI config file which doesn't contain"
      )
    })

    it('should throw an error explaining what to do if no autogenerated comment', async () => {
      process.chdir(path.join(__dirname, 'files', 'without-hook'))
      const hook = new TestHook(logger)
      const state = await hook.install()
      await expect(hook.commitInstall(state)).rejects.toThrow('Please update your CircleCI config to include')
    })

    it(`should add a job with its jobConfig to a file with a comment if it's not there`, async () => {
      process.chdir(path.join(__dirname, 'files', 'comment-without-hook'))

      const hook = new TestHook(logger)
      const state = await hook.install()
      await hook.commitInstall(state)

      const config = YAML.parse(mockedWriteFile.mock.calls[0][1])
      expect(config).toEqual(
        expect.objectContaining({
          workflows: {
            'tool-kit': expect.objectContaining({
              jobs: expect.arrayContaining([
                expect.objectContaining({
                  'test-job': expect.objectContaining({
                    requires: ['another-job']
                  })
                })
              ])
            }),
            nightly: expect.objectContaining({
              jobs: expect.arrayContaining([
                {
                  'test-job': expect.objectContaining({
                    requires: ['another-job']
                  })
                }
              ])
            })
          }
        })
      )
    })

    it(`should merge jobs from two hooks`, async () => {
      process.chdir(path.join(__dirname, 'files', 'comment-without-hook'))

      const hook = new TestHook(logger)
      const anotherHook = new TestAnotherHook(logger)
      let state = await hook.install()
      state = await anotherHook.install(state)
      await hook.commitInstall(state)

      const config = YAML.parse(mockedWriteFile.mock.calls[0][1])
      expect(config).toEqual(
        expect.objectContaining({
          workflows: {
            'tool-kit': expect.objectContaining({
              jobs: expect.arrayContaining([
                expect.objectContaining({
                  'test-job': expect.objectContaining({
                    requires: ['another-job']
                  })
                }),
                expect.objectContaining({
                  'test-another-job': expect.objectContaining({
                    requires: ['another-job']
                  })
                })
              ])
            }),
            nightly: expect.objectContaining({
              jobs: expect.arrayContaining([
                {
                  'test-job': expect.objectContaining({
                    requires: ['another-job']
                  })
                }
              ])
            })
          }
        })
      )
    })

    it(`should discard job from duplicate hook`, async () => {
      process.chdir(path.join(__dirname, 'files', 'comment-without-hook'))

      const hook = new TestHook(logger)
      const sameHook = new TestHook(logger)
      let state = await hook.install()
      state = await sameHook.install(state)
      await hook.commitInstall(state)

      const config = YAML.parse(mockedWriteFile.mock.calls[0][1])
      const partialExpectedJob = {
        'test-job': expect.objectContaining({
          requires: ['another-job']
        })
      }
      const { jobs } = config.workflows['tool-kit']
      expect(jobs).toHaveLength(4)
      for (let i = 0; i < 3; i++) {
        expect(jobs[i]).toEqual(expect.not.objectContaining(partialExpectedJob))
      }
      expect(jobs[3]).toEqual(expect.objectContaining(partialExpectedJob))
    })
  })
})
