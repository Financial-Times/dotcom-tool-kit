import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import { PackageJsonHook } from '../src'

describe('package.json hook', () => {
  describe('check', () => {
    class TestHook extends PackageJsonHook {
      script = 'test-hook'
      hook = 'test:hook'
    }

    const originalDir = process.cwd()

    afterEach(() => {
      process.chdir(originalDir)
    })

    it('should return true when package.json has hook call in script', async () => {
      process.chdir(path.join(__dirname, 'files', 'with-hook'))
      const hook = new TestHook()

      expect(await hook.check()).toBeTruthy()
    })

    it('should return true when script includes other hooks', async () => {
      process.chdir(path.join(__dirname, 'files', 'multiple-hooks'))
      const hook = new TestHook()

      expect(await hook.check()).toBeTruthy()
    })

    it(`should return false when package.json doesn't have hook call in script`, async () => {
      process.chdir(path.join(__dirname, 'files', 'without-hook'))
      const hook = new TestHook()

      expect(await hook.check()).toBeFalsy()
    })
  })
})
