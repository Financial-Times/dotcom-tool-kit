import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import { expect, test } from '@jest/globals'
import winston, { type Logger } from 'winston'

import { TelemetryProcess, TelemetryRecorder, type TelemetryEvent } from '../src'
import { ChildProcess, fork } from 'node:child_process'

const logger = winston as unknown as Logger

function createAndRegisterMockServer() {
  const server = createServer()
  server.listen()
  process.env.TOOL_KIT_TELEMETRY_ENDPOINT = `http://localhost:${(server.address() as AddressInfo).port}`
  return server
}

async function listenForTelemetry(mockServer: Server, metricCount: number, responseTimeout?: number) {
  let requestListener
  const metrics = await new Promise<TelemetryEvent[][]>((resolve) => {
    const metrics: TelemetryEvent[][] = []
    requestListener = (req, res) => {
      const bodyBuffer: Uint8Array[] = []
      req
        .on('data', (chunk) => {
          bodyBuffer.push(chunk)
        })
        .on('end', () => {
          const body = Buffer.concat(bodyBuffer).toString()
          const parsed = JSON.parse(body)
          metrics.push(parsed)
          if (metrics.flat().length >= metricCount) {
            resolve(metrics)
          }
        })

      const sendResponse = () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('metric received\n')
      }
      responseTimeout ? setTimeout(sendResponse, responseTimeout) : sendResponse()
    }
    mockServer.on('request', requestListener)
  })
  mockServer.removeListener('request', requestListener)

  expect(metrics.flat()).toHaveLength(metricCount)
  return metrics
}

describe('attribute handling', () => {
  const metricsMock = jest.fn()
  const mockProcessor = {
    recordEvent: metricsMock
  } as unknown as TelemetryProcess
  beforeEach(() => metricsMock.mockClear())

  test('event attribute included', () => {
    const recorder = new TelemetryRecorder(mockProcessor, { foo: 'bar' })
    recorder.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    expect(metricsMock).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ foo: 'bar' }) })
    )
  })

  test('parent attributes inherited', () => {
    const recorder = new TelemetryRecorder(mockProcessor, { foo: 'bar' })
    const child = recorder.scoped({ baz: 'qux' })
    child.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    expect(metricsMock).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ foo: 'bar', baz: 'qux' }) })
    )
  })

  test('grandparent attributes inherited', () => {
    const recorder = new TelemetryRecorder(mockProcessor, { foo: 'bar' })
    const grandchild = recorder.scoped({ baz: 'qux' }).scoped({ test: 'pass' })
    grandchild.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    expect(metricsMock).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ foo: 'bar', baz: 'qux', test: 'pass' }) })
    )
  })

  test('parent attributes overridable', () => {
    const recorder = new TelemetryRecorder(mockProcessor, { foo: 'bar' })
    const child = recorder.scoped({ foo: 'baz' })
    child.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    expect(metricsMock).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ foo: 'baz' }) })
    )
  })

  test("can't override event metadata", () => {
    const recorder = new TelemetryRecorder(mockProcessor, { namespace: 'foo', eventTimestamp: '137' })
    recorder.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    expect(metricsMock).toHaveBeenCalledWith(
      expect.objectContaining({ namespace: 'dotcom-tool-kit.tasks.completed' })
    )
    expect(metricsMock).not.toHaveBeenCalledWith(expect.objectContaining({ eventTimestamp: '137' }))
  })
})

describe('communication with child', () => {
  let mockServer: Server
  let telemetryChildProcess: ChildProcess

  beforeEach(() => {
    mockServer = createAndRegisterMockServer()
    telemetryChildProcess = fork(`${__dirname}/metricsProcess.mjs`, { env: { ...process.env } })
  })
  afterEach(() => {
    mockServer.close()
    telemetryChildProcess.kill()
  })

  test('metrics are still sent after parent has exited', async () => {
    telemetryChildProcess.send({ action: 'send' })
    telemetryChildProcess.send({ action: 'send' })
    telemetryChildProcess.send({ action: 'disconnect' })
    // first metric will only finish sending once we receive it here
    const metrics = await listenForTelemetry(mockServer, 2, 10)
    expect(metrics).toHaveLength(2)
  })
})

describe('conditionally enabled', () => {
  const metricsMock = jest.fn()
  jest.doMock('node:child_process', () => ({
    fork: jest.fn(() => ({
      connected: true,
      send: metricsMock,
      unref: jest.fn()
    }))
  }))
  /* eslint-disable-next-line @typescript-eslint/no-var-requires --
   * use a require here to include the mocked module
   **/
  const { TelemetryProcess }: typeof import('../src') = require('../lib')

  beforeEach(() => metricsMock.mockClear())

  test('no metrics are sent by default', () => {
    const telemetryProcess = new TelemetryProcess(logger)
    telemetryProcess.root().recordEvent('tasks.completed', 'mock-system-code', { success: true })
    expect(metricsMock).not.toHaveBeenCalled()
  })

  test('metrics are sent when enabled', () => {
    const telemetryProcess = new TelemetryProcess(logger, true)
    telemetryProcess.root().recordEvent('tasks.completed', 'mock-system-code', { success: true })
    expect(metricsMock).toHaveBeenCalled()
  })

  test('recorded metrics are back-sent once telemetry is enabled', () => {
    const telemetryProcess = new TelemetryProcess(logger, false)
    telemetryProcess.root().recordEvent('tasks.completed', 'mock-system-code', { success: true })
    telemetryProcess.root().recordEvent('tasks.completed', 'mock-system-code', { success: true })
    telemetryProcess.root().recordEvent('tasks.completed', 'mock-system-code', { success: true })
    telemetryProcess.enable()
    expect(metricsMock).toHaveBeenCalledTimes(3)
  })
})

describe('metrics sent', () => {
  let mockServer: Server
  let telemetryProcess: TelemetryProcess
  beforeEach(() => {
    mockServer = createAndRegisterMockServer()
    telemetryProcess = new TelemetryProcess(logger, true)
  })
  afterEach(() => {
    mockServer.close()
    telemetryProcess.disconnect()
    jest.useRealTimers()
  })

  test('a metric is sent successfully', async () => {
    const listeningPromise = listenForTelemetry(mockServer, 1)
    telemetryProcess.root().recordEvent('tasks.completed', 'mock-system-code', { success: true })
    const metrics = await listeningPromise
    expect(metrics).toEqual([
      [
        expect.objectContaining({
          namespace: 'dotcom-tool-kit.tasks.completed',
          systemCode: 'mock-system-code'
        })
      ]
    ])
  })

  // TODO:IM:20260107 enable this test once we have multiple different metric types
  test.skip('metrics of different types are sent successfully', async () => {
    const listeningPromise = listenForTelemetry(mockServer, 2)
    const recorder = telemetryProcess.root()
    recorder.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    recorder.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    const metrics = await listeningPromise
    expect(metrics.flat()).toEqual([
      expect.objectContaining({
        namespace: 'dotcom-tool-kit.tasks.completed',
        systemCode: 'mock-system-code'
      }),
      expect.objectContaining({
        namespace: 'dotcom-tool-kit.tasks.completed',
        systemCode: 'mock-system-code'
      })
    ])
  })

  test('buffers multiple metrics sent together', async () => {
    const listeningPromise = listenForTelemetry(mockServer, 3, 10)
    const recorder = telemetryProcess.root()
    recorder.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    recorder.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    recorder.recordEvent('tasks.completed', 'mock-system-code', { success: true })
    const metrics = await listeningPromise
    expect(metrics[1]).toHaveLength(2)
  })

  test('uses timestamp from when recorded, not sent', async () => {
    jest.useFakeTimers({ now: 0 })
    const listeningPromise = listenForTelemetry(mockServer, 1)
    telemetryProcess.root().recordEvent('tasks.completed', 'mock-system-code', { success: true })
    jest.setSystemTime(20)
    const metrics = await listeningPromise
    expect(metrics[0][0].eventTimestamp).toBe(0)
  })
})
