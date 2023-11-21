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

describe('cli', () => {
  // TODO:KB:202301121 we only return conflicts for hooks that are defined.
  // currently there are no hooks lol
  it.skip('should indicate when there are conflicts', async () => {
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

    expect(() => validateConfig(validPluginConfig, logger)).toThrow(ToolKitError)
    expect(validPluginConfig).toHaveProperty('commandTasks.build:ci.conflicting')
    expect(validPluginConfig).toHaveProperty('commandTasks.build:remote.conflicting')
    expect(validPluginConfig).toHaveProperty('commandTasks.build:local.conflicting')
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

    expect(() => validateConfig(validPluginConfig, logger)).toThrow(ToolKitError)
    expect(config).toHaveProperty('commandTasks.build:ci.conflicting')
    expect(config).toHaveProperty('commandTasks.build:remote.conflicting')
    expect(config).toHaveProperty('commandTasks.build:local.conflicting')
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
      const validConfig = validateConfig(validPluginConfig, logger)
      expect(validConfig).not.toHaveProperty('hooks.build:local.conflicting')
    } catch (e) {
      if (e instanceof ToolKitError) {
        e.message += '\n' + e.details
      }

      throw e
    }
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
      const validConfig = validateConfig(validPluginConfig, logger)

      expect(validConfig).not.toHaveProperty('commandTasks.build:local.conflicting')
      expect(validConfig.commandTasks['build:local'].tasks).toEqual([
        'WebpackDevelopment',
        'BabelDevelopment'
      ])
    } catch (e) {
      if (e instanceof ToolKitError) {
        e.message += '\n' + e.details
      }

      throw e
    }
  })
})
