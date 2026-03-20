import { describe, it, expect } from '@jest/globals'
import { join, resolve } from 'node:path'
import NodeTest, { schema } from '../../src/tasks/node-test'
import winston, { Logger } from 'winston'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { PassThrough } from 'node:stream'

const fixturesPath = resolve(__dirname, '..', 'files')

const defaultOptions = schema.parse({})

describe('NodeTest', () => {
  let logger: Logger
  let log: jest.Mock

  beforeEach(() => {
    log = jest.fn()
    const logStream = new PassThrough()
    logStream.on('data', (data) => log(data.toString()))

    logger = winston.createLogger({
      transports: [new winston.transports.Stream({ stream: logStream })]
    })
  })

  it('does not error when the tests pass', async () => {
    const task = new NodeTest(logger, 'NodeTest', {}, defaultOptions)
    await expect(task.run({ command: 'test:local', cwd: join(fixturesPath, 'passing-js') })).resolves.toBe(
      undefined
    )
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/passing test suite/))
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/pass 4/))
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/fail 0/))
  })

  it('errors when the tests fail', async () => {
    const task = new NodeTest(logger, 'NodeTest', {}, defaultOptions)
    await expect(task.run({ command: 'test:local', cwd: join(fixturesPath, 'failing-js') })).rejects.toThrow(
      ToolKitError
    )
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/failing test suite/))
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/pass 0/))
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/fail 1/))
  })

  it('finds tests based on the given file patterns', async () => {
    const task = new NodeTest(logger, 'NodeTest', {}, { ...defaultOptions, files: ['**/*.foo.js'] })
    await expect(task.run({ command: 'test:local', cwd: join(fixturesPath, 'file-pattern') })).resolves.toBe(
      undefined
    )
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/passing test suite/))
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/pass 1/))
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/fail 0/))
  })

  it('ignores tests based on the given file patterns', async () => {
    const task = new NodeTest(logger, 'NodeTest', {}, { ...defaultOptions, ignore: ['subfolder/*'] })
    await expect(task.run({ command: 'test:local', cwd: join(fixturesPath, 'passing-js') })).resolves.toBe(
      undefined
    )
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/passing test suite/))
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/pass 2/))
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/fail 0/))
  })

  it('can accept custom options (timeout)', async () => {
    const task = new NodeTest(logger, 'NodeTest', {}, { ...defaultOptions, customOptions: { timeout: 100 } })
    await expect(task.run({ command: 'test:local', cwd: join(fixturesPath, 'timeout') })).rejects.toThrow(
      ToolKitError
    )
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/✖/))
  })
})
