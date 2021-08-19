// The standard Jest types clash with the mocha types in the global scope so
// explicitly import them instead.
import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import Mocha from '../../src/tasks/mocha'

describe('mocha', () => {
  it('should succeed with passing tests', async () => {
    const task = new Mocha({
      files: path.resolve(__dirname, '../files/pass') + '/**/*.js'
    })

    await task.run()
  })

  it('should throw with failing tests', async () => {
    const task = new Mocha({
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
