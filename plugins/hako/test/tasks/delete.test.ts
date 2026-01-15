import HakoDelete, { schema } from '../../src/tasks/delete'
import winston, { Logger } from 'winston'
import { spawn } from 'node:child_process'
import { readState } from '@dotcom-tool-kit/state'
import { createHash } from 'node:crypto'

const mockSpawn = jest.mocked(spawn)
const mockReadState = jest.mocked(readState)

const logger = winston as unknown as Logger

jest.mock('node:child_process', () => ({
  spawn: jest.fn()
}))

jest.mock('@dotcom-tool-kit/logger', () => ({
  ...jest.requireActual('@dotcom-tool-kit/logger'),
  hookFork: jest.fn(),
  waitOnExit: jest.fn()
}))

jest.mock('@dotcom-tool-kit/state', () => ({
  readState: jest.fn()
}))

describe('HakoDelete', () => {
  it('should delete an app by name', async () => {
    const task = new HakoDelete(
      logger,
      'HakoDelete',
      {},
      schema.parse({
        appName: 'app',
        environments: ['ft-com-review-eu']
      }),
      { id: 'plugin', root: '' }
    )

    await task.run()

    expect(mockSpawn.mock.lastCall?.[1].slice(-6)).toEqual([
      'app',
      'delete',
      '--app',
      'app',
      '--env',
      'ft-com-review-eu'
    ])
  })

  it('should suffix app name with hashed branch name if review app', async () => {
    const branch = 'branch-' + Math.floor(parseInt('zzzzz', 36) * Math.random()).toString(36)

    const hashedBranch = createHash('sha256').update(branch).digest('hex').slice(0, 6)

    mockReadState.mockReturnValue({
      branch
    })

    const task = new HakoDelete(
      logger,
      'HakoDelete',
      {},
      schema.parse({
        appName: 'app',
        asReviewApp: true,
        environments: ['ft-com-review-eu']
      }),
      { id: 'plugin', root: '' }
    )

    await task.run()

    expect(mockSpawn.mock.lastCall?.[1].slice(-6)).toEqual([
      'app',
      'delete',
      '--app',
      `app-${hashedBranch}`,
      '--env',
      'ft-com-review-eu'
    ])
  })

  it('should suffix app name with ephemeral id if present', async () => {
    const task = new HakoDelete(
      logger,
      'HakoDelete',
      {},
      schema.parse({
        appName: 'app',
        ephemeralId: 'canary',
        environments: ['ft-com-review-eu']
      }),
      { id: 'plugin', root: '' }
    )

    await task.run()

    expect(mockSpawn.mock.lastCall?.[1].slice(-6)).toEqual([
      'app',
      'delete',
      '--app',
      'app-canary',
      '--env',
      'ft-com-review-eu'
    ])
  })
})
