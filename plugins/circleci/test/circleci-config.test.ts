import { describe, it, expect } from '@jest/globals'
import path from 'path'
import CircleCiConfigHook from '../src/circleci-config'
import * as yaml from 'js-yaml'
import { promises as fs } from 'fs'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

describe('CircleCI config hook', () => {
  class TestHook extends CircleCiConfigHook {
    job = 'test-job'
    jobOptions = {
      requires: ['another-job']
    }
    addToNightly = true
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
    it('should throw an error explaining what to do if no autogenerated comment', async () => {
      process.chdir(path.join(__dirname, 'files', 'without-hook'))
      const hook = new TestHook(logger)

      await expect(hook.install()).rejects.toThrow('Please update your CircleCI config to include')
    })

    it(`should add a job with its jobConfig to a file with a comment if it's not there`, async () => {
      process.chdir(path.join(__dirname, 'files', 'comment-without-hook'))
      const configPath = path.join(__dirname, 'files', 'comment-without-hook', '.circleci', 'config.yml')
      const originalYaml = await fs.readFile(configPath, 'utf8')

      try {
        const hook = new TestHook(logger)
        await hook.install()

        const config = yaml.load(await fs.readFile(configPath, 'utf8'))

        expect(config).toEqual(
          expect.objectContaining({
            orbs: {
              'tool-kit': 'financial-times/dotcom-tool-kit@2'
            },
            workflows: {
              'tool-kit': {
                jobs: expect.arrayContaining([
                  expect.objectContaining({
                    'test-job': expect.objectContaining({
                      requires: ['another-job']
                    })
                  })
                ])
              },
              nightly: {
                jobs: expect.arrayContaining([
                  expect.objectContaining({
                    'test-job': expect.objectContaining({
                      requires: ['another-job']
                    })
                  })
                ])
              }
            }
          })
        )
      } finally {
        await fs.writeFile(configPath, originalYaml)
      }
    })
  })
})
