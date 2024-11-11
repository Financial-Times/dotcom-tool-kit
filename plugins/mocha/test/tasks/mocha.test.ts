// The standard Jest types clash with the mocha types in the global scope so
// explicitly import them instead.
import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import Mocha from '../../src/tasks/mocha'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

describe('mocha', () => {
  it('should succeed with passing tests', async () => {
    const task = new Mocha(
      logger,
      'Mocha',
      {},
      {
        files: path.resolve(__dirname, '../files/pass') + '/**/*.js'
      }
    )

    await task.run({ command: 'test:local', cwd: '' })
  })

  it('should throw with failing tests', async () => {
    const task = new Mocha(
      logger,
      'Mocha',
      {},
      {
        files: path.resolve(__dirname, '../files/fail') + '/**/*.js'
      }
    )

    await expect(task.run({ command: 'test:local', cwd: '' })).rejects.toThrowErrorMatchingInlineSnapshot(
      `"mocha process returned a non-zero exit code (1)"`
    )
  })
})
