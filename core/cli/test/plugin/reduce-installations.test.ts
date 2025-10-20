import path from 'path'
import { Hook, HookClass } from '@dotcom-tool-kit/base'
import { isConflict } from '@dotcom-tool-kit/conflict'
import { z } from 'zod'
import winston, { Logger } from 'winston'
import { loadConfig } from '../../src/config'
import { HookModule, reducePluginHookInstallations } from '../../src/plugin/reduce-installations'

const logger = winston as unknown as Logger

const testHookSchema = z.any()

class TestHook extends Hook<
  {
    hook: typeof testHookSchema
  },
  void
> {
  static schema = z.any()

  async isInstalled() {
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async install() {}
}

const hookClasses = {
  TestHook: {
    hookClass: TestHook as HookClass,
    schema: testHookSchema
  }
} satisfies Record<string, HookModule>

describe('reducePluginHookInstallations', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('single installation per plugin', () => {
    it("should return conflict if mergeChildInstallations returns conflict that's not resolved by overrideChildInstallations", async () => {
      const config = await loadConfig(logger, {
        root: path.resolve(__dirname, './files/single-install/merge-children')
      })

      jest.spyOn(TestHook, 'mergeChildInstallations').mockImplementation(
        // NOTE: this is the default implementation from the Hook base class,
        // repeating it here in the mock for clarity and consistency with other tests
        (plugin, childInstallations) => [
          {
            plugin,
            conflicting: childInstallations.flatMap((installation) =>
              isConflict(installation) ? installation.conflicting : installation
            )
          }
        ]
      )

      const mergedInstallations = reducePluginHookInstallations(
        logger,
        config,
        hookClasses,
        config.plugins['app root']
      ).unwrap('hook installations were invalid')

      expect(mergedInstallations).toMatchObject([
        {
          plugin: config.plugins['app root'],
          conflicting: [
            {
              plugin: config.plugins['./a'],
              options: {
                a: true
              }
            },
            {
              plugin: config.plugins['./b'],
              options: {
                b: true
              }
            }
          ]
        }
      ])
    })

    it('should return resolved installation returned by mergeChildInstallations', async () => {
      const config = await loadConfig(logger, {
        root: path.resolve(__dirname, './files/single-install/merge-children')
      })

      jest.spyOn(TestHook, 'mergeChildInstallations').mockImplementation((plugin, childInstallations) => [
        {
          plugin,
          forHook: 'TestHook',
          hookConstructor: TestHook,
          options: Object.fromEntries(
            childInstallations.flatMap((child) => (isConflict(child) ? [] : Object.entries(child.options)))
          )
        }
      ])

      const mergedInstallations = reducePluginHookInstallations(
        logger,
        config,
        hookClasses,
        config.plugins['app root']
      ).unwrap('hook installations were invalid')

      expect(mergedInstallations).toMatchObject([
        {
          plugin: config.plugins['app root'],
          options: {
            a: true,
            b: true
          }
        }
      ])
    })

    it('should return resolved installation returned by overrideChildInstallations', async () => {
      const config = await loadConfig(logger, {
        root: path.resolve(__dirname, './files/single-install/override-children')
      })

      jest.spyOn(TestHook, 'overrideChildInstallations').mockImplementation(
        // NOTE: this is the default implementation from the Hook base class,
        // repeating it here in the mock for clarity and consistency with other tests
        (plugin, parentInstallation, _childInstallations) => [parentInstallation]
      )

      const mergedInstallations = reducePluginHookInstallations(
        logger,
        config,
        hookClasses,
        config.plugins['app root']
      ).unwrap('hook installations were invalid')

      expect(mergedInstallations).toMatchObject([
        {
          plugin: config.plugins['app root'],
          options: {
            c: true
          }
        }
      ])
    })

    it('should return resolved installation merged by overrideChildInstallations', async () => {
      const config = await loadConfig(logger, {
        root: path.resolve(__dirname, './files/single-install/override-children')
      })

      jest.spyOn(TestHook, 'overrideChildInstallations').mockImplementation(
        // NOTE: this implementation naively merges installations between parents and children.
        // that's not a usual use case, but CircleCi and PackageJson both do this in limited cases.
        (plugin, parentInstallation, childInstallations) => [
          {
            ...parentInstallation,
            options: Object.fromEntries(
              [parentInstallation, ...childInstallations].flatMap((installation) =>
                isConflict(installation)
                  ? installation.conflicting.flatMap((child) => Object.entries(child.options))
                  : Object.entries(installation.options)
              )
            ),
            plugin
          }
        ]
      )

      const mergedInstallations = reducePluginHookInstallations(
        logger,
        config,
        hookClasses,
        config.plugins['app root']
      ).unwrap('hook installations were invalid')

      expect(mergedInstallations).toMatchObject([
        {
          plugin: config.plugins['app root'],
          options: {
            a: true,
            b: true
          }
        }
      ])
    })

    it('should return conflict returned by overrideChildInstallations', async () => {
      const config = await loadConfig(logger, {
        root: path.resolve(__dirname, './files/single-install/override-children')
      })

      jest.spyOn(TestHook, 'overrideChildInstallations').mockImplementation(
        // NOTE: check which plugin is overriding; only return a conflict at the app root stage
        (plugin, parentInstallation, childInstallations) =>
          plugin.id === 'app root'
            ? [
                {
                  plugin,
                  conflicting: childInstallations.flatMap((installation) =>
                    isConflict(installation) ? installation.conflicting : installation
                  )
                }
              ]
            : Hook.overrideChildInstallations(plugin, parentInstallation, childInstallations)
      )

      const mergedInstallations = reducePluginHookInstallations(
        logger,
        config,
        hookClasses,
        config.plugins['app root']
      ).unwrap('hook installations were invalid')

      expect(mergedInstallations).toMatchObject([
        {
          plugin: config.plugins['app root'],
          conflicting: [
            {
              plugin: config.plugins['./a'],
              options: {
                a: true
              }
            },
            {
              plugin: config.plugins['./b'],
              options: {
                b: true
              }
            }
          ]
        }
      ])
    })

    it('should return resolved installation returned by overrideChildInstallations at multiple layers of nesting', async () => {
      const config = await loadConfig(logger, {
        root: path.resolve(__dirname, './files/single-install/nested-override')
      })

      jest.spyOn(TestHook, 'overrideChildInstallations').mockImplementation(
        // NOTE: this is the default implementation from the Hook base class,
        // repeating it here in the mock for clarity and consistency with other tests
        (plugin, parentInstallation, _childInstallations) => [parentInstallation]
      )

      const mergedInstallations = reducePluginHookInstallations(
        logger,
        config,
        hookClasses,
        config.plugins['app root']
      ).unwrap('hook installations were invalid')

      expect(mergedInstallations).toMatchObject([
        {
          plugin: config.plugins['./b'],
          options: {
            b: true
          }
        }
      ])
    })

    it('should return resolved installation merged by overrideChildInstallations at multiple layers of nesting', async () => {
      const config = await loadConfig(logger, {
        root: path.resolve(__dirname, './files/single-install/nested-override')
      })

      jest.spyOn(TestHook, 'overrideChildInstallations').mockImplementation(
        // NOTE: this implementation naively merges installations between parents and children.
        // that's not a usual use case, but CircleCi and PackageJson both do this in limited cases.
        (plugin, parentInstallation, childInstallations) => [
          {
            ...parentInstallation,
            options: Object.fromEntries(
              [parentInstallation, ...childInstallations].flatMap((installation) =>
                isConflict(installation)
                  ? installation.conflicting.flatMap((child) => Object.entries(child.options))
                  : Object.entries(installation.options)
              )
            ),
            plugin
          }
        ]
      )

      const mergedInstallations = reducePluginHookInstallations(
        logger,
        config,
        hookClasses,
        config.plugins['app root']
      ).unwrap('hook installations were invalid')

      expect(mergedInstallations).toMatchObject([
        {
          plugin: config.plugins['./b'],
          options: {
            a: true,
            b: true
          }
        }
      ])
    })
  })
})
