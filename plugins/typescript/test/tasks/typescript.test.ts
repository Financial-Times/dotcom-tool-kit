import { describe, jest, it, expect } from '@jest/globals'
import TypeScript from '../../src/tasks/typescript.js'
import { fork } from 'child_process'
import EventEmitter from 'events'
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
jest.mock('@dotcom-tool-kit/logger')

const tscPath = require.resolve('typescript/bin/tsc')
const configPath = 'tsconfig.json'

describe('typescript', () => {
  it('should run tsc', async () => {
    const task = new TypeScript(logger, 'TypeScript', {}, { configPath })
    await task.run()

    expect(fork).toBeCalledWith(tscPath, ['--project', configPath], { silent: true })
  })

  it('watch option should run tsc with --watch arg', async () => {
    const task = new TypeScript(logger, 'TypeScript', {}, { configPath, watch: true })
    await task.run()

    expect(fork).toBeCalledWith(tscPath, ['--watch', '--project', configPath], { silent: true })
  })

  it('noEmit option should run tsc with --noEmit arg', async () => {
    const task = new TypeScript(logger, 'TypeScript', {}, { configPath, noEmit: true })
    await task.run()

    expect(fork).toBeCalledWith(tscPath, ['--noEmit', '--project', configPath], { silent: true })
  })

  it('build option should run tsc with --build arg', async () => {
    const task = new TypeScript(logger, 'TypeScript', {}, { configPath, build: true })
    await task.run()

    expect(fork).toBeCalledWith(tscPath, ['--build', '--project', configPath], { silent: true })
  })

  it('can combine options', async () => {
    const task = new TypeScript(
      logger,
      'TypeScript',
      {},
      { configPath, build: true, watch: true, noEmit: true }
    )
    await task.run()

    expect(fork).toBeCalledWith(tscPath, ['--build', '--watch', '--noEmit', '--project', configPath], {
      silent: true
    })
  })
})
