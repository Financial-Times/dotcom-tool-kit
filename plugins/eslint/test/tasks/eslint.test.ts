import { ToolKitError } from '@dotcom-tool-kit/error/lib'
import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import winston, { Logger } from 'winston'
import ESLint from '../../src/tasks/eslint'

const logger = (winston as unknown) as Logger

const testDirectory = path.join(__dirname, '../files')

describe('eslint', () => {
  it('should pass on correct file', async () => {
    const task = new ESLint(logger, 'ESLint', {
      options: { ignore: false, cwd: testDirectory },
      files: [path.join(testDirectory, 'pass.js')]
    })

    await task.run()
  })

  it('should fail on linter error', async () => {
    const task = new ESLint(logger, 'ESLint', {
      options: { ignore: false, cwd: testDirectory },
      files: [path.join(testDirectory, 'fail.js')]
    })

    expect.assertions(1)
    try {
      await task.run()
    } catch (err) {
      if (err instanceof ToolKitError) expect(err.details).toContain('1 problem (1 error, 0 warnings)')
    }
  })
})
