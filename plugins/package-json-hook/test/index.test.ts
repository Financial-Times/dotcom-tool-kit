import * as path from 'path'
import { promises as fs } from 'fs'

import { describe, expect, it } from '@jest/globals'
import winston, { type Logger } from 'winston'

import { type HookInstallation } from '@dotcom-tool-kit/base'
import { type PackageJsonSchema } from '@dotcom-tool-kit/schemas/lib/hooks/package-json'

import PackageJson from '../src/package-json-helper'

const logger = winston as unknown as Logger

describe('package.json hook', () => {
  const originalDir = process.cwd()

  afterEach(() => {
    process.chdir(originalDir)
  })

  describe('check', () => {
    it('should return true when package.json has hook call in script', async () => {
      process.chdir(path.join(__dirname, 'files', 'with-hook'))
      const hook = new PackageJson(logger, 'PackageJson', {
        scripts: {
          'test-hook': 'test:hook'
        }
      })

      expect(await hook.isInstalled()).toBeTruthy()
    })

    it('should return true when script includes other hooks', async () => {
      process.chdir(path.join(__dirname, 'files', 'multiple-hooks'))
      const hook = new PackageJson(logger, 'PackageJson', {
        scripts: {
          'test-hook': 'test:hook'
        }
      })

      expect(await hook.isInstalled()).toBeTruthy()
    })

    it(`should return false when package.json doesn't have hook call in script`, async () => {
      process.chdir(path.join(__dirname, 'files', 'without-hook'))
      const hook = new PackageJson(logger, 'PackageJson', {
        scripts: {
          'test-hook': 'test:hook'
        }
      })

      expect(await hook.isInstalled()).toBeFalsy()
    })
  })

  describe('install', () => {
    it(`should add script when it doesn't exist`, async () => {
      const base = path.join(__dirname, 'files', 'without-hook')

      const pkgPath = path.join(base, 'package.json')
      const originalJson = await fs.readFile(pkgPath, 'utf-8')

      process.chdir(base)

      try {
        const hook = new PackageJson(logger, 'PackageJson', {
          scripts: {
            'test-hook': 'test:hook'
          }
        })
        const state = await hook.install()
        await hook.commitInstall(state)

        const packageJson = JSON.parse(await fs.readFile(pkgPath, 'utf-8'))

        expect(packageJson).toMatchInlineSnapshot(`
          Object {
            "scripts": Object {
              "test-hook": "dotcom-tool-kit test:hook",
            },
          }
        `)
      } finally {
        await fs.writeFile(pkgPath, originalJson)
      }
    })

    it(`should append trailingString field`, async () => {
      const base = path.join(__dirname, 'files', 'without-hook')

      const pkgPath = path.join(base, 'package.json')
      const originalJson = await fs.readFile(pkgPath, 'utf-8')

      process.chdir(base)

      try {
        const hook = new PackageJson(logger, 'PackageJson', {
          scripts: {
            'test-hook': {
              trailingString: '--',
              commands: 'test:hook'
            }
          }
        })
        const state = await hook.install()
        await hook.commitInstall(state)

        const packageJson = JSON.parse(await fs.readFile(pkgPath, 'utf-8'))

        expect(packageJson).toMatchInlineSnapshot(`
          Object {
            "scripts": Object {
              "test-hook": "dotcom-tool-kit test:hook --",
            },
          }
        `)
      } finally {
        await fs.writeFile(pkgPath, originalJson)
      }
    })

    it(`should allow nested field property`, async () => {
      const base = path.join(__dirname, 'files', 'without-hook')

      const pkgPath = path.join(base, 'package.json')
      const originalJson = await fs.readFile(pkgPath, 'utf-8')

      process.chdir(base)

      try {
        const hook = new PackageJson(logger, 'PackageJson', {
          'scripts.nested': {
            'test-hook': 'test:hook'
          }
        })
        const state = await hook.install()
        await hook.commitInstall(state)

        const packageJson = JSON.parse(await fs.readFile(pkgPath, 'utf-8'))

        expect(packageJson).toMatchInlineSnapshot(`
          Object {
            "scripts": Object {
              "nested": Object {
                "test-hook": "dotcom-tool-kit test:hook",
              },
            },
          }
        `)
      } finally {
        await fs.writeFile(pkgPath, originalJson)
      }
    })
  })

  describe('conflict resolution', () => {
    it('should merge children setting different fields', () => {
      const childInstallations = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:local'
            }
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              build: 'build:local'
            }
          }
        },
        {
          plugin: { id: 'c', root: 'plugins/c' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            another: {
              field: 'something:else'
            }
          }
        }
      ]
      const plugin = { id: 'p', root: 'plugins/p' }

      expect(
        PackageJson.mergeChildInstallations(
          plugin,
          childInstallations as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>[]
        )
      ).toEqual([
        {
          plugin,
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:local',
              build: 'build:local'
            },
            another: {
              field: 'something:else'
            }
          }
        }
      ])
    })

    it('should conflict sibling plugins setting the same field', () => {
      const childInstallations = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:local'
            }
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:ci'
            }
          }
        }
      ]

      const plugin = { id: 'p', root: 'plugins/p' }

      expect(
        PackageJson.mergeChildInstallations(
          plugin,
          childInstallations as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>[]
        )
      ).toEqual([
        {
          plugin,
          conflicting: childInstallations
        }
      ])
    })

    it('should split conflicting and non-conflicting sibling plugins', () => {
      const childInstallations = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:local'
            }
          }
        },
        {
          plugin: { id: 'b', root: 'plugins/b' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:ci'
            }
          }
        },
        {
          plugin: { id: 'c', root: 'plugins/c' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              build: 'build:local'
            }
          }
        },
        {
          plugin: { id: 'd', root: 'plugins/d' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              start: 'run:local'
            }
          }
        }
      ]

      const plugin = { id: 'p', root: 'plugins/p' }

      expect(
        PackageJson.mergeChildInstallations(
          plugin,
          childInstallations as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>[]
        )
      ).toEqual([
        {
          plugin,
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              build: 'build:local',
              start: 'run:local'
            }
          }
        },
        {
          plugin,
          conflicting: [
            {
              plugin: { id: 'a', root: 'plugins/a' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  test: 'test:local'
                }
              }
            },
            {
              plugin: { id: 'b', root: 'plugins/b' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  test: 'test:ci'
                }
              }
            }
          ]
        }
      ])
    })

    it('should merge parent and child installations, preferring parent', () => {
      const plugin = { id: 'p', root: 'plugins/p' }

      const parentInstallation = {
        plugin,
        forHook: 'PackageJson',
        hookConstructor: PackageJson,
        options: {
          scripts: {
            test: 'test:local'
          }
        }
      }

      const childInstallations = [
        {
          plugin: { id: 'a', root: 'plugins/a' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:ci'
            },
            another: {
              field: 'something:else'
            }
          }
        }
      ]

      expect(
        PackageJson.overrideChildInstallations(
          plugin,
          parentInstallation as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>,
          childInstallations as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>[]
        )
      ).toEqual([
        {
          plugin,
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:local'
            },
            another: {
              field: 'something:else'
            }
          }
        }
      ])
    })

    it(`should override conflicts that are solved by the parent`, () => {
      const plugin = { id: 'p', root: 'plugins/p' }

      const parentInstallation = {
        plugin,
        forHook: 'PackageJson',
        hookConstructor: PackageJson,
        options: {
          scripts: {
            test: 'test:local'
          }
        }
      }

      const childInstallations = [
        {
          plugin: { id: 'c', root: 'plugins/c' },
          conflicting: [
            {
              plugin: { id: 'a', root: 'plugins/a' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  test: 'test:local'
                }
              }
            },
            {
              plugin: { id: 'b', root: 'plugins/b' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  test: 'test:ci'
                }
              }
            }
          ]
        }
      ]

      expect(
        PackageJson.overrideChildInstallations(
          plugin,
          parentInstallation as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>,
          childInstallations as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>[]
        )
      ).toEqual([
        {
          plugin,
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:local'
            }
          }
        }
      ])
    })

    it(`should keep conflicts that aren't solved by the parent`, () => {
      const plugin = { id: 'p', root: 'plugins/p' }

      const parentInstallation = {
        plugin,
        forHook: 'PackageJson',
        hookConstructor: PackageJson,
        options: {
          scripts: {
            test: 'test:local'
          }
        }
      }

      const childInstallations = [
        {
          plugin: { id: 'c', root: 'plugins/c' },
          conflicting: [
            {
              plugin: { id: 'a', root: 'plugins/a' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  build: 'build:local'
                }
              }
            },
            {
              plugin: { id: 'b', root: 'plugins/b' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  build: 'build:ci'
                }
              }
            }
          ]
        }
      ]

      expect(
        PackageJson.overrideChildInstallations(
          plugin,
          parentInstallation as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>,
          childInstallations as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>[]
        )
      ).toEqual([
        {
          plugin,
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:local'
            }
          }
        },
        {
          plugin: { id: 'p', root: 'plugins/p' },
          conflicting: childInstallations[0].conflicting
        }
      ])
    })

    it(`should partially override only the conflicts solvable by the parent`, () => {
      const plugin = { id: 'p', root: 'plugins/p' }

      const parentInstallation = {
        plugin,
        forHook: 'PackageJson',
        hookConstructor: PackageJson,
        options: {
          scripts: {
            test: 'test:local'
          }
        }
      }

      const childInstallations = [
        {
          plugin: { id: 'd', root: 'plugins/d' },
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            another: {
              field: 'something:else'
            }
          }
        },
        {
          plugin: { id: 'c', root: 'plugins/c' },
          conflicting: [
            {
              plugin: { id: 'a', root: 'plugins/a' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  build: 'build:local'
                }
              }
            },
            {
              plugin: { id: 'b', root: 'plugins/b' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  build: 'build:ci'
                }
              }
            },
            {
              plugin: { id: 'e', root: 'plugins/e' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  test: 'test:local'
                }
              }
            },
            {
              plugin: { id: 'f', root: 'plugins/f' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  test: 'test:ci'
                }
              }
            }
          ]
        }
      ]

      expect(
        PackageJson.overrideChildInstallations(
          plugin,
          parentInstallation as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>,
          childInstallations as unknown as HookInstallation<Zod.output<typeof PackageJsonSchema>>[]
        )
      ).toEqual([
        {
          plugin,
          forHook: 'PackageJson',
          hookConstructor: PackageJson,
          options: {
            scripts: {
              test: 'test:local'
            },
            another: {
              field: 'something:else'
            }
          }
        },
        {
          plugin: { id: 'p', root: 'plugins/p' },
          conflicting: [
            {
              plugin: { id: 'a', root: 'plugins/a' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  build: 'build:local'
                }
              }
            },
            {
              plugin: { id: 'b', root: 'plugins/b' },
              forHook: 'PackageJson',
              hookConstructor: PackageJson,
              options: {
                scripts: {
                  build: 'build:ci'
                }
              }
            }
          ]
        }
      ])
    })
  })
})
