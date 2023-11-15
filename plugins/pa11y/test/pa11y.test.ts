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
  let MOCK_ENV: 'local' | 'ci' = 'local'
  beforeEach(() => {
    jest.mocked(state.readState).mockImplementation((stateType) => {
      let returnState
      if (stateType === 'local' && MOCK_ENV === 'local') {
        returnState = { port: 5050 } as state.LocalState
      } else if (stateType === 'review' && MOCK_ENV === 'ci') {
        returnState = { appName } as state.ReviewState
      }
      return returnState
    })
  })
  it("sets process.env.TEST_URL as a herokuapp url if readState('review') is truthy", async () => {
    MOCK_ENV = 'ci'
    const pa11y = new Pa11y(logger, {})
    await pa11y.run()

    expect(process.env.TEST_URL).toBe(`https://${appName}.herokuapp.com`)
  })
  it("sets process.env.TEST_URL as a local env url if readState('local') is truthy", async () => {
    MOCK_ENV = 'local'
    const pa11y = new Pa11y(logger, {})
    await pa11y.run()

    expect(process.env.TEST_URL).toBe(`https://local.ft.com:5050`)
  })
})
