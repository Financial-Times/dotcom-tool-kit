import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import { promises as fs } from 'fs'
import { PackageJsonScriptHook } from '../src'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

describe('package.json hook', () => {
  class TestHook extends PackageJsonScriptHook {
    key = 'test-hook'
    hook = 'test:hook'
  }

  const originalDir = process.cwd()

  afterEach(() => {
    process.chdir(originalDir)
  })

  describe('check', () => {
    it('should return true when package.json has hook call in script', async () => {
      process.chdir(path.join(__dirname, 'files', 'with-hook'))
      const hook = new TestHook(logger)

      expect(await hook.check()).toBeTruthy()
    })

    it('should return true when script includes other hooks', async () => {
      process.chdir(path.join(__dirname, 'files', 'multiple-hooks'))
      const hook = new TestHook(logger)

      expect(await hook.check()).toBeTruthy()
    })

    it(`should return false when package.json doesn't have hook call in script`, async () => {
      process.chdir(path.join(__dirname, 'files', 'without-hook'))
      const hook = new TestHook(logger)

      expect(await hook.check()).toBeFalsy()
    })
  })

  describe('install', () => {
    it(`should add script when it doesn't exist`, async () => {
      const base = path.join(__dirname, 'files', 'without-hook')

      const pkgPath = path.join(base, 'package.json')
      const originalJson = await fs.readFile(pkgPath, 'utf-8')

      process.chdir(base)

      try {
        const hook = new TestHook(logger)
        const state = await hook.install()
        await hook.commitInstall(state)

        const packageJson = JSON.parse(await fs.readFile(pkgPath, 'utf-8'))

        expect(packageJson).toHaveProperty(['scripts', 'test-hook'], 'dotcom-tool-kit test:hook')
      } finally {
        await fs.writeFile(pkgPath, originalJson)
      }
    })
  })
})
