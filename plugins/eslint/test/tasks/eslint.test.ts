import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import winston, { Logger } from 'winston'
import ESLint from '../../src/tasks/eslint'
import temp from 'temp'
import fs from 'fs/promises'

const logger = winston as unknown as Logger

describe('eslint', () => {
  let testDirectory: string

  beforeAll(async () => {
    testDirectory = await temp.mkdir('eslint')

    await fs.writeFile(
      path.join(testDirectory, '.eslintrc.js'),
      `module.exports = {
        extends: 'eslint:recommended',
        root: true
      }`
    )

    await fs.writeFile(path.join(testDirectory, 'pass.js'), `1 + 1`)
    await fs.writeFile(path.join(testDirectory, 'fail.js'), `undeclared`)
  })

  afterAll(async () => {
    await temp.cleanup()
  })

  it('should pass on correct file', async () => {
    const task = new ESLint(
      logger,
      'ESLint',
      {},
      {
        configPath: path.join(testDirectory, '.eslintrc.js'),
        files: [path.join(testDirectory, 'pass.js')]
      }
    )

    await expect(task.run()).resolves.toBeUndefined()
  })

  it('should fail on linter error', async () => {
    const task = new ESLint(
      logger,
      'ESLint',
      {},
      {
        configPath: path.join(testDirectory, '.eslintrc.js'),
        files: [path.join(testDirectory, 'fail.js')]
      }
    )

    await expect(task.run()).rejects.toHaveProperty(
      'details',
      expect.stringContaining('1 problem (1 error, 0 warnings)')
    )
  })
})
