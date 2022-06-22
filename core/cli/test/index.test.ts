import { ToolKitError } from '@dotcom-tool-kit/error'
import { Plugin, Valid } from '@dotcom-tool-kit/types'
import { describe, expect, it, jest } from '@jest/globals'
import * as path from 'path'
import winston, { Logger } from 'winston'
import { createConfig, validateConfig, validatePlugins, ValidPluginsConfig } from '../src/config'
import { loadPlugin, resolvePlugin } from '../src/plugin'

const logger = (winston as unknown) as Logger

// Loading all the plugins can (unfortunately) take longer than the default 2s timeout
jest.setTimeout(20000)

function makeRootRelative(thing: { root: string }) {
  thing.root = path.relative(process.cwd(), thing.root)
}

function makeConfigPathsRelative(config: RawConfig) {
  makeRootRelative(config)

  for (const validated of Object.values(config.plugins)) {
    mapValidated(validated, (plugin) => {
      makeRootRelative(plugin)

      if (plugin.parent) {
        makeRootRelative(plugin.parent)
      }

      if (plugin.children) {
        for (const child of plugin.children) {
          makeRootRelative(child)
        }
      }
    })
  }

  for (const assignment of Object.values(config.hookTasks)) {
    makeRootRelative(assignment.plugin)
  }

  for (const hook of Object.values(config.hooks)) {
    if (hook.plugin) makeRootRelative(hook.plugin)
    // We can't use the real CircleCI plugin hook type as that would cause a
    // circular dependency between the two packages.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circleHook = hook as any
    if (circleHook.circleConfigPath) {
      circleHook.circleConfigPath = path.relative(process.cwd(), circleHook.circleConfigPath)
    }
  }

  for (const task of Object.values(config.tasks)) {
    if (task.plugin) makeRootRelative(task.plugin)
  }
}

describe('cli', () => {
  it('should load plugins correctly', async () => {
    const config = createConfig()

    const plugin = await loadPlugin('app root', config, logger, {
      id: 'successful test root',
      root: path.join(__dirname, 'files/successful')
    })
    expect(plugin.valid).toBe(true)

    const validatedPluginConfig = validatePlugins(config)
    expect(validatedPluginConfig.valid).toBe(true)
    const validPluginConfig = (validatedPluginConfig as Valid<ValidPluginsConfig>).value

    resolvePlugin((plugin as Valid<Plugin>).value, validPluginConfig, logger)

    // make every root path in the config relative for consistent snapshots across machines
    makeConfigPathsRelative(config)
    expect(config).toMatchSnapshot()
  })

  it('should indicate when there are conflicts', async () => {
    const config = createConfig()

    const plugin = await loadPlugin('app root', config, logger, {
      id: 'conflicted test root',
      root: path.join(__dirname, 'files/conflicted')
    })
    expect(plugin.valid).toBe(true)

    const validatedPluginConfig = validatePlugins(config)
    expect(validatedPluginConfig.valid).toBe(true)
    const validPluginConfig = (validatedPluginConfig as Valid<ValidPluginsConfig>).value

    resolvePlugin((plugin as Valid<Plugin>).value, validPluginConfig, logger)

    expect(() => validateConfig(validPluginConfig)).toThrow(ToolKitError)
    expect(validPluginConfig).toHaveProperty('hookTasks.build:ci.conflicting')
    expect(validPluginConfig).toHaveProperty('hookTasks.build:remote.conflicting')
    expect(validPluginConfig).toHaveProperty('hookTasks.build:local.conflicting')
  })

  it('should indicate when there are conflicts between plugins that are cousins in the tree', async () => {
    const config = createConfig()

    const plugin = await loadPlugin('app root', config, logger, {
      id: 'conflicted cousin test root',
      root: path.join(__dirname, 'files/cousins')
    })
    expect(plugin.valid).toBe(true)

    const validatedPluginConfig = validatePlugins(config)
    expect(validatedPluginConfig.valid).toBe(true)
    const validPluginConfig = (validatedPluginConfig as Valid<ValidPluginsConfig>).value

    resolvePlugin((plugin as Valid<Plugin>).value, validPluginConfig, logger)

    expect(() => validateConfig(validPluginConfig)).toThrow(ToolKitError)
    expect(config).toHaveProperty('hookTasks.build:ci.conflicting')
    expect(config).toHaveProperty('hookTasks.build:remote.conflicting')
    expect(config).toHaveProperty('hookTasks.build:local.conflicting')
  })

  it('should not have conflicts between multiple of the same plugin', async () => {
    const config = createConfig()

    const plugin = await loadPlugin('app root', config, logger, {
      id: 'resolved test root',
      root: path.join(__dirname, 'files/duplicate')
    })
    expect(plugin.valid).toBe(true)

    const validatedPluginConfig = validatePlugins(config)
    expect(validatedPluginConfig.valid).toBe(true)
    const validPluginConfig = (validatedPluginConfig as Valid<ValidPluginsConfig>).value

    resolvePlugin((plugin as Valid<Plugin>).value, validPluginConfig, logger)

    try {
      validateConfig(validPluginConfig)
    } catch (e) {
      if (e instanceof ToolKitError) {
        e.message += '\n' + e.details
      }

      throw e
    }

    expect(validPluginConfig).not.toHaveProperty('hooks.build:local.conflicting')
    expect(validPluginConfig.hooks['build:local'].plugin?.id).toEqual('@dotcom-tool-kit/npm')
  })

  it('should succeed when conflicts are resolved', async () => {
    const config = createConfig()

    const plugin = await loadPlugin('app root', config, logger, {
      id: 'resolved test root',
      root: path.join(__dirname, 'files/conflict-resolution')
    })
    expect(plugin.valid).toBe(true)

    const validatedPluginConfig = validatePlugins(config)
    expect(validatedPluginConfig.valid).toBe(true)
    const validPluginConfig = (validatedPluginConfig as Valid<ValidPluginsConfig>).value

    resolvePlugin((plugin as Valid<Plugin>).value, validPluginConfig, logger)

    try {
      validateConfig(validPluginConfig)
    } catch (e) {
      if (e instanceof ToolKitError) {
        e.message += '\n' + e.details
      }

      throw e
    }

    expect(validPluginConfig).not.toHaveProperty('hookTasks.build:local.conflicting')
    expect(validPluginConfig.hookTasks['build:local'].tasks).toEqual([
      'WebpackDevelopment',
      'BabelDevelopment'
    ])
  })
})
