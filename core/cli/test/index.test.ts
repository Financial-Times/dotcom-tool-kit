import { describe, jest, it, expect } from '@jest/globals'
import * as path from 'path'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { RawConfig, createConfig, validateConfig } from '../src/config'
import winston, { Logger } from 'winston'
import { loadPlugin, resolvePlugin } from '../src/plugin'

const logger = (winston as unknown) as Logger

// Loading all the plugins can (unfortunately) take longer than the default 2s timeout
jest.setTimeout(20000)

function makeRootRelative(thing: { root: string }) {
  thing.root = path.relative(process.cwd(), thing.root)
}

function makeConfigPathsRelative(config: RawConfig) {
  makeRootRelative(config)

  for (const plugin of Object.values(config.plugins)) {
    makeRootRelative(plugin)

    if (plugin.parent) {
      makeRootRelative(plugin.parent)
    }

    if (plugin.children) {
      for (const child of plugin.children) {
        makeRootRelative(child)
      }
    }
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

    resolvePlugin(plugin, config, logger)

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

    resolvePlugin(plugin, config, logger)

    expect(() => validateConfig(config)).toThrow(ToolKitError)
    expect(config).toHaveProperty('hookTasks.build:ci.conflicting')
    expect(config).toHaveProperty('hookTasks.build:remote.conflicting')
    expect(config).toHaveProperty('hookTasks.build:local.conflicting')
  })

  it('should indicate when there are conflicts between plugins that are cousins in the tree', async () => {
    const config = createConfig()

    const plugin = await loadPlugin('app root', config, logger, {
      id: 'conflicted cousin test root',
      root: path.join(__dirname, 'files/cousins')
    })

    resolvePlugin(plugin, config, logger)

    expect(() => validateConfig(config)).toThrow(ToolKitError)
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

    resolvePlugin(plugin, config, logger)

    try {
      validateConfig(config)
    } catch (e) {
      if (e instanceof ToolKitError) {
        e.message += e.details
      }

      throw e
    }

    expect(config).not.toHaveProperty('hooks.build:local.conflicting')
    expect(config.hooks['build:local'].plugin?.id).toEqual('@dotcom-tool-kit/npm')
  })

  it('should succeed when conflicts are resolved', async () => {
    const config = createConfig()

    const plugin = await loadPlugin('app root', config, logger, {
      id: 'resolved test root',
      root: path.join(__dirname, 'files/conflict-resolution')
    })

    resolvePlugin(plugin, config, logger)

    try {
      validateConfig(config)
    } catch (e) {
      if (e instanceof ToolKitError) {
        e.message += e.details
      }

      throw e
    }

    expect(config).not.toHaveProperty('hookTasks.build:local.conflicting')
    expect(config.hookTasks['build:local'].tasks).toEqual(['WebpackDevelopment', 'BabelDevelopment'])
  })
})
