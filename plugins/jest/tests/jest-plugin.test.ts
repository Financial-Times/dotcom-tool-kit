import { fork } from 'child_process'
import JestLocal from '../src/tasks/local'
import JestCI from '../src/tasks/ci'
import EventEmitter from 'events'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

jest.mock('child_process', () => ({
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
  describe('local', () => {
    it('should call jest cli with configPath if configPath is passed in', async () => {
      const jestLocal = new JestLocal(logger, { configPath: './src/jest.config.js' })
      await jestLocal.run()

      expect(fork).toBeCalledWith(expect.any(String), ['--colors', '', '--config=./src/jest.config.js'], {
        silent: true
      })
    })

    it('should call jest cli without configPath by default', async () => {
      const jestLocal = new JestLocal(logger)
      await jestLocal.run()

      expect(fork).toBeCalledWith(expect.any(String), ['--colors', '', ''], { silent: true })
    })
  })

  describe('ci', () => {
    it('should call jest cli with configPath if configPath is passed in', async () => {
      const jestCI = new JestCI(logger, { configPath: './src/jest.config.js' })
      await jestCI.run()

      expect(fork).toBeCalledWith(expect.any(String), ['--colors', '--ci', '--config=./src/jest.config.js'], {
        silent: true
      })
    })

    it('should call jest cli without configPath by default', async () => {
      const jestCI = new JestCI(logger)
      await jestCI.run()

      expect(fork).toBeCalledWith(expect.any(String), ['--colors', '--ci', ''], { silent: true })
    })
  })
})
