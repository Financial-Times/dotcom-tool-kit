import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import * as fs from 'fs/promises'
import { PackageJsonHook } from '../src'

describe('package.json hook', () => {
  class TestHook extends PackageJsonHook {
    script = 'test-hook'
    hook = 'test:hook'
  }

  const originalDir = process.cwd()

  afterEach(() => {
    process.chdir(originalDir)
  })

  describe('check', () => {
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

  describe('install', () => {
    it(`should add script when it doesn't exist`, async () => {
      const base = path.join(__dirname, 'files', 'without-hook')

      const pkgPath = path.join(base, 'package.json')
      const originalJson = await fs.readFile(pkgPath, 'utf-8')

      process.chdir(base)

      const hook = new TestHook()
      await hook.install()

      const packageJson = JSON.parse(await fs.readFile(path.join(base, 'package.json'), 'utf-8'))

      expect(packageJson).toHaveProperty(['scripts', 'test-hook'], 'dotcom-tool-kit test:hook')

      await fs.writeFile(pkgPath, originalJson)
    })

    it('should prepend hook to a call with an existing hook', async () => {
      const base = path.join(__dirname, 'files', 'existing-hook')

      const pkgPath = path.join(base, 'package.json')
      const originalJson = await fs.readFile(pkgPath, 'utf-8')

      process.chdir(base)

      const hook = new TestHook()
      await hook.install()

      const packageJson = JSON.parse(await fs.readFile(path.join(base, 'package.json'), 'utf-8'))

      expect(packageJson).toHaveProperty(['scripts', 'test-hook'], 'dotcom-tool-kit test:hook another:hook')

      await fs.writeFile(pkgPath, originalJson)
    })
  })
})
