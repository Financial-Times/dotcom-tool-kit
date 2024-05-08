import { ToolKitError } from '@dotcom-tool-kit/error'
import type { Valid } from '@dotcom-tool-kit/validated'
import type { Plugin } from '@dotcom-tool-kit/plugin'
import type { ValidPluginsConfig } from '@dotcom-tool-kit/config'
import { describe, expect, it, jest } from '@jest/globals'
import * as path from 'path'
import winston, { Logger } from 'winston'
import { createConfig, validateConfig } from '../src/config.js'
import { loadHookInstallations } from '../src/install.js'
import { loadPlugin, resolvePlugin, resolvePluginOptions } from '../src/plugin.js'
import { validatePlugins } from '../src/config/validate-plugins.js'

const logger = winston as unknown as Logger

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

    resolvePluginOptions((plugin as Valid<Plugin>).value, validPluginConfig)
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

    resolvePluginOptions((plugin as Valid<Plugin>).value, validPluginConfig)
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

    resolvePluginOptions((plugin as Valid<Plugin>).value, validPluginConfig)
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

    resolvePluginOptions((plugin as Valid<Plugin>).value, validPluginConfig)
    resolvePlugin((plugin as Valid<Plugin>).value, validPluginConfig, logger)

    try {
      const validConfig = validateConfig(validPluginConfig, logger)

      expect(validConfig).not.toHaveProperty('commandTasks.build:local.conflicting')
      expect(validConfig.commandTasks['build:local'].tasks.map((task) => task.task)).toEqual([
        'Webpack',
        'Babel'
      ])
    } catch (e) {
      if (e instanceof ToolKitError) {
        e.message += '\n' + e.details
      }

      throw e
    }
  })

  it('should successfully install when options for different hooks are defined', async () => {
    const config = createConfig()

    const plugin = await loadPlugin('app root', config, logger, {
      id: 'reolved test root',
      root: path.join(__dirname, 'files/multiple-hook-options')
    })
    expect(plugin.valid).toBe(true)

    const validatedPluginConfig = validatePlugins(config)
    expect(validatedPluginConfig.valid).toBe(true)
    const validPluginConfig = (validatedPluginConfig as Valid<ValidPluginsConfig>).value

    resolvePlugin((plugin as Valid<Plugin>).value, validPluginConfig, logger)

    const validConfig = validateConfig(validPluginConfig, logger)
    const hooks = await loadHookInstallations(logger, validConfig)
    expect(hooks.valid).toBe(true)
  })
})
