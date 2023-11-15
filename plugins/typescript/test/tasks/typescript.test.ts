import { describe, jest, it, expect } from '@jest/globals'
import { TypeScriptBuild, TypeScriptWatch, TypeScriptTest } from '../../src/tasks/typescript'
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

const tscPath = require.resolve('typescript/bin/tsc')
const configPath = 'tsconfig.json'

describe('typescript', () => {
  describe('correct arguments', () => {
    it('should start tsc build with correct arguments', async () => {
      const task = new TypeScriptBuild(logger, 'TypeScriptBuild', { configPath })
      await task.run()

      expect(fork).toBeCalledWith(tscPath, ['--project', configPath], { silent: true })
    })

    it('should start tsc watch with correct arguments', async () => {
      const task = new TypeScriptWatch(logger, 'TypeScriptWatch', { configPath })
      await task.run()

      expect(fork).toBeCalledWith(tscPath, ['--project', configPath, '--watch'], { silent: true })
    })

    it('should start tsc test with correct arguments', async () => {
      const task = new TypeScriptTest(logger, 'TypeScriptTest', { configPath })
      await task.run()

      expect(fork).toBeCalledWith(tscPath, ['--project', configPath, '--noEmit'], { silent: true })
    })

    it('should pass in extra arguments', async () => {
      const extraArgs = ['--verbose', '--force']
      const task = new TypeScriptBuild(logger, 'TypeScriptBuild', { configPath, extraArgs })
      await task.run()

      expect(fork).toBeCalledWith(tscPath, ['--project', configPath, ...extraArgs], {
        silent: true
      })
    })
  })
})
