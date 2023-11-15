import { describe, it, expect, jest } from '@jest/globals'
import Pa11y from '../src/tasks/pa11y'
import winston, { Logger } from 'winston'
import EventEmitter from 'events'
import * as state from '@dotcom-tool-kit/state'

const appName = 'test-app-name'
const logger = (winston as unknown) as Logger

jest.mock('child_process', () => ({
  fork: jest.fn(() => {
    // return a fake emitter that immediately sends an "exit" event, so the pa11y task resolves
    const emitter = new EventEmitter()
    process.nextTick(() => {
      emitter.emit('exit', 0)
    })
    return emitter
  })
}))
jest.mock('@dotcom-tool-kit/logger')
jest.mock('@dotcom-tool-kit/state')

describe('pa11y', () => {
  it("sets process.env.TEST_URL if readState('review') is truthy", async () => {
    jest.mocked(state.readState).mockReturnValue({ appName } as state.ReviewState)

    const pa11y = new Pa11y(logger, 'Pa11y', {})
    await pa11y.run()

    expect(process.env.TEST_URL).toBe(`https://${appName}.herokuapp.com`)
  })
})
