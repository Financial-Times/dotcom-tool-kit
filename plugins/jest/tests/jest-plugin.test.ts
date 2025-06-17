import { fork } from 'node:child_process'
import Jest from '../src/tasks/jest'
import EventEmitter from 'events'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

jest.mock('node:child_process', () => ({
  fork: jest.fn(() => {
    // return a fake emitter that immediately sends an "exit" event, so the jest task resolves
    const emitter = new EventEmitter()
    process.nextTick(() => {
      emitter.emit('exit', 0)
    })
    return emitter
  })
}))
jest.mock('@dotcom-tool-kit/logger')

describe('jest plugin', () => {
  it('should call jest cli without configPath by default', async () => {
    const jest = new Jest(logger, 'Jest', {}, {})
    await jest.run({ command: 'test:local', cwd: '' })

    expect(fork).toHaveBeenCalledWith(
      expect.any(String),
      expect.not.arrayContaining([expect.stringContaining('--config')]),
      { silent: true, cwd: '' }
    )
  })

  it('should call jest cli with configPath if configPath is passed in', async () => {
    const jest = new Jest(logger, 'Jest', {}, { configPath: './src/jest.config.js' })
    await jest.run({ command: 'test:local', cwd: '' })

    expect(fork).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining(['--config=./src/jest.config.js']),
      {
        silent: true,
        cwd: ''
      }
    )
  })

  it('should call jest cli with ci if ci is passed in', async () => {
    const jest = new Jest(logger, 'Jest', {}, { ci: true })
    await jest.run({ command: 'test:local', cwd: '' })

    expect(fork).toHaveBeenCalledWith(expect.any(String), expect.arrayContaining(['--ci']), {
      silent: true,
      cwd: ''
    })
  })
})
