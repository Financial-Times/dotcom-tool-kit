// The standard Jest types clash with the mocha types in the global scope so
// explicitly import them instead.
import { describe, it, expect } from '@jest/globals'
import * as path from 'path'
import Mocha from '../../src/commands/mocha'

describe('mocha', () => {
  it('should succeed with passing tests', async () => {
    const command = new Mocha([])
    command.options.files = path.resolve(__dirname, '../files/pass') + '/**/*.js'
    await command.run()
  })

  it('should throw with failing tests', async () => {
    const command = new Mocha([])
    command.options.files = path.resolve(__dirname, '../files/fail') + '/**/*.js'

    expect.assertions(1)
    try {
      await command.run()
    } catch (err) {
      expect(err).toBeTruthy()
    }
  })
})
