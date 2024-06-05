import { describe, jest, it, expect } from '@jest/globals'
import Webpack from '../../src/tasks/webpack.js'
import { fork } from 'child_process'
import EventEmitter from 'events'
import { fileURLToPath } from 'url'
import winston, { Logger } from 'winston'

const logger = winston as unknown as Logger

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
const mockedFork = jest.mocked(fork)
jest.mock('@dotcom-tool-kit/logger')

const webpackCLIPath = fileURLToPath(import.meta.resolve('webpack-cli/bin/cli'))

describe('webpack', () => {
  describe('development', () => {
    it('should call webpack cli with correct arguments', async () => {
      const configPath = 'webpack.config.js'
      const task = new Webpack(logger, 'Webpack', {}, { configPath, envName: 'development' })
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
      const task = new Webpack(logger, 'Webpack', {}, { configPath, envName: 'production' })
      await task.run()

      expect(fork).toBeCalledWith(
        webpackCLIPath,
        ['build', '--color', '--mode=production', '--config=webpack.config.js'],
        { silent: true, execArgv: expect.arrayContaining([]) }
      )
    })
  })

  describe('OpenSSL legacy handling', () => {
    it('should be enabled when the flag is available', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      process.allowedNodeEnvironmentFlags = { has: jest.fn(() => true) } as any

      const configPath = 'webpack.config.js'
      const task = new Webpack(logger, 'Webpack', {}, { configPath, envName: 'production' })
      await task.run()

      expect(mockedFork.mock.calls[0][2]?.execArgv).toEqual(
        expect.arrayContaining(['--openssl-legacy-provider'])
      )
    })

    it("shouldn't be present when the flag is not available", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      process.allowedNodeEnvironmentFlags = { has: jest.fn(() => false) } as any

      const configPath = 'webpack.config.js'
      const task = new Webpack(logger, 'Webpack', {}, { configPath, envName: 'production' })
      await task.run()

      expect(mockedFork.mock.calls[0][2]?.execArgv).toEqual(
        expect.not.arrayContaining(['--openssl-legacy-provider'])
      )
    })
  })
})
