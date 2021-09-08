import { describe, it, expect } from '@jest/globals'
import path from 'path'
import CircleCiConfigHook from '../src/circleci-config'

describe('CircleCI config hook', () => {
  class TestHook extends CircleCiConfigHook {
    job = 'test-job'
  }

  const originalDir = process.cwd()

  afterEach(() => {
    process.chdir(originalDir)
  })

  describe('check', () => {
    it('should return true if the hook job is in the circleci workflow', async () => {
      process.chdir(path.join(__dirname, 'files', 'with-hook'))
      const hook = new TestHook()
      expect(await hook.check()).toBeTruthy()
    })

    it('should return false if the hook job is not in the circleci workflow', async () => {
      process.chdir(path.join(__dirname, 'files', 'without-hook'))
      const hook = new TestHook()
      expect(await hook.check()).toBeFalsy()
    })
  })
})
