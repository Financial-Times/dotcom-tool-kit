import { type HookInstallation } from '@dotcom-tool-kit/base'
import type {
  CircleCiWorkflowJob,
  CircleCiJob,
  CircleCiOptions
} from '@dotcom-tool-kit/schemas/lib/hooks/circleci'
import { describe, expect, it } from '@jest/globals'
import path from 'path'
import winston, { Logger } from 'winston'
import * as YAML from 'yaml'

import CircleCi from '../src/circleci-config'

const logger = winston as unknown as Logger

const testJob: CircleCiJob = {
  name: 'test-job',
  command: 'test:local'
}

const testWorkflowJob: CircleCiWorkflowJob = {
  name: 'test-job',
  requires: ['that-job'],
  splitIntoMatrix: false
}

const testPrefixedWorkflowJob: CircleCiWorkflowJob = {
  name: 'slack/approval-notification',
  requires: ['another/orb'],
  splitIntoMatrix: false
}

const overriddenTestJob: CircleCiJob = { ...testJob, command: 'test:override' }
const anotherTestJob: CircleCiJob = {
  name: 'another-test-job',
  command: 'test:ci'
}

const anotherTestWorkflowJob: CircleCiWorkflowJob = {
  name: 'another-test-job',
  requires: ['this-job'],
  splitIntoMatrix: true
}

const configWithWorkflowJob: CircleCiOptions = {
  workflows: [{ name: 'tool-kit', jobs: [testWorkflowJob] }]
}

const configWithPrefixedWorkflowJob: CircleCiOptions = {
  workflows: [{ name: 'tool-kit', jobs: [testPrefixedWorkflowJob] }]
}

const configWithJob: CircleCiOptions = {
  jobs: [testJob]
}

describe('CircleCI config hook', () => {
  const originalDir = process.cwd()

  afterEach(() => {
    process.chdir(originalDir)
  })

  describe('isInstalled', () => {
    it('should return true if the workflow job is in the circleci workflow', async () => {
      process.chdir(path.join(__dirname, 'files', 'unmanaged', 'with-workflow-job'))
      const hook = new CircleCi(logger, 'CircleCi', configWithWorkflowJob, {
        cimgNodeVersions: [],
        tagFilterRegex: ''
      })
      expect(await hook.isInstalled()).toBeTruthy()
    })

    it('should return false if the workflow job is not in the circleci workflow', async () => {
      process.chdir(path.join(__dirname, 'files', 'unmanaged', 'without-workflow-job'))
      const hook = new CircleCi(logger, 'CircleCi', configWithWorkflowJob, {
        cimgNodeVersions: [],
        tagFilterRegex: ''
      })
      expect(await hook.isInstalled()).toBeFalsy()
    })
  })

  describe('install', () => {
    it("should throw an error explaining how to autogenerate config if existing config file doesn't contain any tool-kit jobs", async () => {
      process.chdir(path.join(__dirname, 'files', 'unmanaged', 'without-tool-kit'))
      const hook = new CircleCi(logger, 'CircleCi', configWithWorkflowJob, {
        cimgNodeVersions: [],
        tagFilterRegex: ''
      })
      const state = await hook.install()
      await expect(hook.commitInstall(state)).rejects.toThrow(
        "Your project has an existing CircleCI config file which doesn't contain"
      )
    })

    it('should throw an error explaining what to do if no autogenerated comment', async () => {
      process.chdir(path.join(__dirname, 'files', 'unmanaged', 'without-workflow-job'))
      const hook = new CircleCi(logger, 'CircleCi', configWithWorkflowJob, {
        cimgNodeVersions: [],
        tagFilterRegex: ''
      })
      const state = await hook.install()
      await expect(hook.commitInstall(state)).rejects.toThrow(
        'Your CircleCI configuration is missing the expected fields from Tool Kit:'
      )
    })

    it("should add a workflow job with its jobConfig to managed file if it's not there", async () => {
      process.chdir(path.join(__dirname, 'files', 'managed', 'without-workflow-job'))

      const hook = new CircleCi(logger, 'CircleCi', configWithWorkflowJob, {
        cimgNodeVersions: [],
        tagFilterRegex: ''
      })

      expect((await hook.install()).workflows).toMatchInlineSnapshot(`
        {
          "tool-kit": {
            "jobs": [
              {
                "test-job": {
                  "executor": "node",
                  "requires": [
                    "that-job",
                  ],
                },
              },
            ],
          },
        }
      `)
    })

    it("should add a job to managed file if it's not there", async () => {
      process.chdir(path.join(__dirname, 'files', 'managed', 'without-job'))

      const hook = new CircleCi(logger, 'CircleCi', configWithJob, {
        cimgNodeVersions: [],
        tagFilterRegex: ''
      })

      expect((await hook.install()).jobs).toMatchInlineSnapshot(`
        {
          "test-job": {
            "steps": [
              {
                "run": {
                  "command": "npx dotcom-tool-kit test:local",
                  "name": "test-job",
                },
              },
            ],
          },
        }
      `)
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

    it('should merge sibling plugins with different custom fields for a workflow job', () => {
      const childInstallations: HookInstallation<CircleCiOptions>[] = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            jobs: [testJob],
            workflows: [{ name: 'tool-kit', jobs: [{ ...testWorkflowJob, custom: { param1: 'a' } }] }]
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'CircleCi',
          hookConstructor: CircleCi,
          options: {
            workflows: [{ name: 'tool-kit', jobs: [{ name: testWorkflowJob.name, custom: { param2: 'b' } }] }]
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
            workflows: expect.arrayContaining([
              expect.objectContaining({
                name: 'tool-kit',
                jobs: expect.arrayContaining([
                  expect.objectContaining({
                    name: testWorkflowJob.name,
                    custom: expect.objectContaining({ param1: 'a', param2: 'b' })
                  })
                ])
              })
            ])
          })
        }
      ])
    })
  })
})
