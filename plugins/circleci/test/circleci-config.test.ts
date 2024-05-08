import { type HookInstallation } from '@dotcom-tool-kit/base'
import { setOptions } from '@dotcom-tool-kit/options'
import type {
  CircleCiWorkflowJob,
  CircleCiJob,
  CircleCiOptions
} from '@dotcom-tool-kit/schemas/lib/hooks/circleci'
import { describe, expect, it } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import winston, { Logger } from 'winston'
import * as YAML from 'yaml'

import CircleCi from '../src/circleci-config.js'

const logger = winston as unknown as Logger

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs')

  return {
    ...originalModule,
    promises: { ...originalModule.promises, writeFile: jest.fn() }
  }
})
const mockedWriteFile = jest.mocked(fs.promises.writeFile)

const testJob: CircleCiJob = {
  name: 'test-job',
  command: 'test:local'
}
const testWorkflowJob: CircleCiWorkflowJob = {
  name: 'test-job',
  requires: ['waiting-for-approval', 'that-job'],
  splitIntoMatrix: false
}
const overriddenTestJob: CircleCiJob = { ...testJob, command: 'test:override' }
const anotherTestJob: CircleCiJob = {
  name: 'another-test-job',
  command: 'test:ci'
}
const anotherTestWorkflowJob: CircleCiWorkflowJob = {
  name: 'another-test-job',
  requires: ['waiting-for-approval', 'this-job'],
  splitIntoMatrix: true
}
const simpleOptions: CircleCiOptions = {
  jobs: [testJob],
  workflows: [{ name: 'tool-kit', jobs: [testWorkflowJob] }],
  disableBaseConfig: true
}

describe('CircleCI config hook', () => {
  const originalDir = process.cwd()

  beforeAll(() => {
    // mirror the default options created by zod
    setOptions('@dotcom-tool-kit/circleci', { cimgNodeVersions: ['16.14-browsers'] })
  })

  afterEach(() => {
    process.chdir(originalDir)
  })

  describe('isInstalled', () => {
    it('should return true if the hook job is in the circleci workflow', async () => {
      process.chdir(path.join(__dirname, 'files', 'with-hook'))
      const hook = new CircleCi(logger, 'CircleCi', simpleOptions)
      expect(await hook.isInstalled()).toBeTruthy()
    })

    it('should return false if the hook job is not in the circleci workflow', async () => {
      process.chdir(path.join(__dirname, 'files', 'without-hook'))
      const hook = new CircleCi(logger, 'CircleCi', simpleOptions)
      expect(await hook.isInstalled()).toBeFalsy()
    })

    it('should return false if the base configuration is missing', async () => {
      process.chdir(path.join(__dirname, 'files', 'with-hook'))
      const hook = new CircleCi(logger, 'CircleCi', { ...simpleOptions, disableBaseConfig: false })
      expect(await hook.isInstalled()).toBeFalsy()
    })
  })

  describe('install', () => {
    it("should throw an error explaining how to autogenerate config if existing config file doesn't contain any tool-kit jobs", async () => {
      process.chdir(path.join(__dirname, 'files', 'without-tool-kit'))
      const hook = new CircleCi(logger, 'CircleCi', simpleOptions)
      const state = await hook.install()
      await expect(hook.commitInstall(state)).rejects.toThrow(
        "Your project has an existing CircleCI config file which doesn't contain"
      )
    })

    it('should throw an error explaining what to do if no autogenerated comment', async () => {
      process.chdir(path.join(__dirname, 'files', 'without-hook'))
      const hook = new CircleCi(logger, 'CircleCi', simpleOptions)
      const state = await hook.install()
      await expect(hook.commitInstall(state)).rejects.toThrow(
        'Your CircleCI configuration is missing the expected fields from Tool Kit:'
      )
    })

    it("should add a job with its jobConfig to a file with a comment if it's not there", async () => {
      process.chdir(path.join(__dirname, 'files', 'comment-without-hook'))

      const hook = new CircleCi(logger, 'CircleCi', simpleOptions)
      const state = await hook.install()
      await hook.commitInstall(state)

      const config = YAML.parse(mockedWriteFile.mock.calls[0][1] as string)
      expect(config).toEqual(
        expect.objectContaining({
          workflows: expect.objectContaining({
            'tool-kit': expect.objectContaining({
              jobs: expect.arrayContaining([
                expect.objectContaining({
                  'tool-kit/test-job': expect.objectContaining({
                    requires: ['waiting-for-approval', 'tool-kit/that-job']
                  })
                })
              ])
            })
          })
        })
      )
    })
  })

  describe('conflict resolution', () => {
    it('should merge children setting different fields', () => {
      const childInstallations: HookInstallation<CircleCiOptions>[] = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            executors: [
              {
                name: 'test-executor',
                image: 'cimg/node:16.19'
              }
            ]
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            jobs: [testJob]
          }
        },
        {
          plugin: { id: 'c', root: 'plugins/c' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            workflows: [{ name: 'test-workflow', jobs: [testWorkflowJob], runOnRelease: true }]
          }
        }
      ]
      const plugin = { id: 'p', root: 'plugins/p' }

      expect(CircleCi.mergeChildInstallations(plugin, childInstallations)).toEqual([
        {
          plugin,
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: expect.objectContaining({
            executors: [
              {
                name: 'test-executor',
                image: 'cimg/node:16.19'
              }
            ],
            jobs: [testJob],
            workflows: [{ name: 'test-workflow', jobs: [testWorkflowJob], runOnRelease: true }]
          })
        }
      ])
    })

    it('should merge child overriding root options', () => {
      const plugin = { id: 'p', root: 'plugins/p' }
      const parentInstallation: HookInstallation<CircleCiOptions> = {
        plugin: { id: 'a', root: 'plugins/a' },
        forHook: 'CircleCi',
        hookConstructor: CircleCi,
        options: {
          jobs: [overriddenTestJob],
          workflows: [{ name: 'test-workflow', jobs: [anotherTestWorkflowJob] }]
        }
      }

      const childInstallations: HookInstallation<CircleCiOptions>[] = [
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            jobs: [testJob],
            workflows: [{ name: 'test-workflow', jobs: [testWorkflowJob], runOnRelease: true }]
          }
        }
      ]

      expect(CircleCi.overrideChildInstallations(plugin, parentInstallation, childInstallations)).toEqual([
        {
          plugin,
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: expect.objectContaining({
            jobs: [overriddenTestJob],
            workflows: [
              { name: 'test-workflow', jobs: [testWorkflowJob, anotherTestWorkflowJob], runOnRelease: true }
            ]
          })
        }
      ])
    })

    it('should merge sibling plugins setting the same field', () => {
      const childInstallations: HookInstallation<CircleCiOptions>[] = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            jobs: [testJob]
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            jobs: [anotherTestJob]
          }
        }
      ]

      const plugin = { id: 'p', root: 'plugins/p' }

      expect(CircleCi.mergeChildInstallations(plugin, childInstallations)).toEqual([
        {
          plugin,
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: expect.objectContaining({
            jobs: expect.arrayContaining([testJob, anotherTestJob])
          })
        }
      ])
    })

    it('should conflict sibling plugins setting the same job', () => {
      const childInstallations: HookInstallation<CircleCiOptions>[] = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            jobs: [testJob]
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            jobs: [overriddenTestJob]
          }
        }
      ]

      const plugin = { id: 'p', root: 'plugins/p' }

      expect(CircleCi.mergeChildInstallations(plugin, childInstallations)).toEqual([
        {
          plugin,
          conflicting: childInstallations
        }
      ])
    })

    it('should conflict sibling plugins with the same custom field', () => {
      const childInstallations: HookInstallation<CircleCiOptions>[] = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            custom: {
              version: '2.0'
            }
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            custom: {
              version: '2.1'
            }
          }
        }
      ]

      const plugin = { id: 'p', root: 'plugins/p' }

      expect(CircleCi.mergeChildInstallations(plugin, childInstallations)).toEqual([
        {
          plugin,
          conflicting: childInstallations
        }
      ])
    })

    it('should conflict sibling plugins with the same deep custom field', () => {
      const childInstallations: HookInstallation<CircleCiOptions>[] = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            custom: {
              parameters: {
                'test-param': {
                  type: 'string',
                  default: 'test'
                }
              }
            }
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            custom: {
              parameters: {
                'test-param': {
                  type: 'number',
                  default: 137
                }
              }
            }
          }
        }
      ]

      const plugin = { id: 'p', root: 'plugins/p' }

      expect(CircleCi.mergeChildInstallations(plugin, childInstallations)).toEqual([
        {
          plugin,
          conflicting: childInstallations
        }
      ])
    })

    it('should merge sibling plugins with different custom fields', () => {
      const childInstallations: HookInstallation<CircleCiOptions>[] = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            custom: {
              version: '2.0'
            }
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            custom: {
              parameters: {
                'test-param': {
                  type: 'number',
                  default: 137
                }
              }
            }
          }
        }
      ]

      const plugin = { id: 'p', root: 'plugins/p' }

      expect(CircleCi.mergeChildInstallations(plugin, childInstallations)).toEqual([
        {
          plugin,
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: expect.objectContaining({
            custom: {
              version: '2.0',
              parameters: {
                'test-param': {
                  type: 'number',
                  default: 137
                }
              }
            }
          })
        }
      ])
    })
  })
})
