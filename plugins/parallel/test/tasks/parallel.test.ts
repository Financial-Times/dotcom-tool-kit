import { beforeAll, describe, expect, it } from '@jest/globals'

import { z } from 'zod'
import path from 'node:path'
import { Task } from '@dotcom-tool-kit/base'
import { ValidConfig } from '@dotcom-tool-kit/config'
import { importEntryPoint as _importEntryPoint } from 'dotcom-tool-kit/lib/plugin/entry-point'
import { valid } from '@dotcom-tool-kit/validated'
import winston, { Logger } from 'winston'

import Parallel from '../../src/tasks/parallel'

const importEntryPoint = _importEntryPoint as jest.Mock

jest.mock('dotcom-tool-kit/lib/plugin/entry-point', () => ({
  importEntryPoint: jest.fn()
}))

const logger = winston as unknown as Logger

const OneOffSchema = z.object({
  id: z.number()
})

class TestOneOffTask extends Task<{ task: typeof OneOffSchema }> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async run() {}
}

const runMock = jest.spyOn(TestOneOffTask.prototype, 'run')

const config = {
  root: __dirname,
  plugins: {},
  tasks: {
    TestOneOffTask: { plugin: { id: 'test', root: 'test/path' }, modulePath: 'test/path/task' }
  },
  resolutionTrackers: {
    reducedInstallationPlugins: new Set(),
    resolvedPluginOptions: new Set(),
    resolvedPlugins: new Set(),
    substitutedPlugins: new Set()
  },
  inits: [],
  hookManagedFiles: new Set(),
  commandTasks: {},
  pluginOptions: {},
  taskOptions: {},
  hooks: {}
} satisfies ValidConfig

describe('parallel task', () => {
  describe('one-off tasks', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      importEntryPoint.mockResolvedValue(valid({ baseClass: TestOneOffTask }))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should load the tasks provided in its config', async () => {
      const task = new Parallel(
        logger,
        'parallel',
        {},
        {
          tasks: [{ TestOneOffTask: { id: 1 } }, { TestOneOffTask: { id: 2 } }],
          onError: 'wait-for-others'
        },
        { id: '@dotcom-tool-kit/parallel', root: path.resolve(__dirname, '../../') }
      )

      await task.run({ command: 'test:command', cwd: __dirname, config })

      expect(importEntryPoint).toBeCalledWith(Task, config.tasks.TestOneOffTask)
    })

    it('should run the tasks provided in its config with their options and the same run context', async () => {
      const task = new Parallel(
        logger,
        'parallel',
        {},
        {
          tasks: [{ TestOneOffTask: { duration: 1 } }, { TestOneOffTask: { duration: 2 } }],
          onError: 'wait-for-others'
        },
        { id: '@dotcom-tool-kit/parallel', root: path.resolve(__dirname, '../../') }
      )

      const context = { command: 'test:command', cwd: __dirname, config }
      await task.run(context)

      expect(task.taskInstances[0].run).toBeCalledWith(context)
      expect(task.taskInstances[0].options).toEqual({ duration: 1 })

      expect(task.taskInstances[1].run).toBeCalledWith(context)
      expect(task.taskInstances[1].options).toEqual({ duration: 2 })
    })

    it('should run the tasks in parallel', async () => {
      const task = new Parallel(
        logger,
        'parallel',
        {},
        {
          tasks: [{ TestOneOffTask: { id: 1 } }, { TestOneOffTask: { id: 2 } }],
          onError: 'wait-for-others'
        },
        { id: '@dotcom-tool-kit/parallel', root: path.resolve(__dirname, '../../') }
      )

      const events: string[] = []

      runMock.mockImplementation(async function (this: TestOneOffTask) {
        events.push(`start ${this.options.id}`)
        await Promise.resolve()
        events.push(`finish ${this.options.id}`)
      })

      await task.run({ command: 'test:command', cwd: __dirname, config })

      expect(events).toEqual(['start 1', 'start 2', 'finish 1', 'finish 2'])
    })
  })
})
