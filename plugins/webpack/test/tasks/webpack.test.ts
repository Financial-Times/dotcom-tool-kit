import { describe, jest, it, expect } from '@jest/globals'
import DevelopmentWebpack from '../../src/tasks/development'
import ProductionWebpack from '../../src/tasks/production'
import { fork } from 'child_process'
import EventEmitter from 'events'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

jest.mock('child_process', () => ({
  fork: jest.fn(() => {
    // return a fake emitter that immediately sends an "exit" event, so the webpack task resolves
    const emitter = new EventEmitter()
    process.nextTick(() => {
      emitter.emit('exit', 0)
    })
    return emitter
  })
}))
jest.mock('@dotcom-tool-kit/logger')

const webpackCLIPath = require.resolve('webpack-cli/bin/cli')

describe('webpack', () => {
  describe('development', () => {
    it('should call webpack cli with correct arguments', async () => {
      const configPath = 'webpack.config.js'
      const task = new DevelopmentWebpack(logger, { configPath })
      await task.run()

      expect(fork).toBeCalledWith(
        webpackCLIPath,
        ['build', '--color', '--mode=development', '--config=webpack.config.js'],
        { silent: true, execArgv: expect.arrayContaining([]) }
      )
    })
  })

  describe('production', () => {
    it('should call webpack cli with correct arguments', async () => {
      const configPath = 'webpack.config.js'
      const task = new ProductionWebpack(logger, { configPath })
      await task.run()

      expect(fork).toBeCalledWith(
        webpackCLIPath,
        ['build', '--color', '--mode=production', '--config=webpack.config.js'],
        { silent: true, execArgv: expect.arrayContaining([]) }
      )
    })
  })
})
