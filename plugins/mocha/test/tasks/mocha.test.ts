// The standard Jest types clash with the mocha types in the global scope so
// explicitly import them instead.
import * as path from 'path'

import { describe, expect, it } from '@jest/globals'
import winston, { type Logger } from 'winston'

import Mocha from '../../src/tasks/mocha'

const logger = winston as unknown as Logger

describe('mocha', () => {
  it('should succeed with passing tests', async () => {
    const task = new Mocha(logger, 'Mocha', {
      files: path.resolve(__dirname, '../files/pass') + '/**/*.js'
    })

    await task.run()
  })

  it('should throw with failing tests', async () => {
    const task = new Mocha(logger, 'Mocha', {
      files: path.resolve(__dirname, '../files/fail') + '/**/*.js'
    })

    expect.assertions(1)
    try {
      await task.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})
