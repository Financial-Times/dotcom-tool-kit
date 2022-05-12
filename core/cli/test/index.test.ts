import { describe, jest, it, expect } from '@jest/globals'
import * as path from 'path'
import { ToolKitError } from '@dotcom-tool-kit/error'
import { Config, loadConfig, validateConfig } from '../src/config'
import { loadPluginConfig } from '../src/plugin'
import winston, { Logger } from 'winston'

const logger = (winston as unknown) as Logger

// Loading all the plugins can (unfortunately) take longer than the default 2s timeout
jest.setTimeout(20000)

function makeRootRelative(thing: { root: string }) {
  thing.root = path.relative(process.cwd(), thing.root)
}

function makeConfigPathsRelative(config: Config) {
  makeRootRelative(config)

  for (const plugin of Object.values(config.plugins)) {
    makeRootRelative(plugin)
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
    const config = await loadConfig(logger)

    await loadPluginConfig(
      logger,
      { id: 'successful test root', root: path.join(__dirname, 'files/successful') },
      config
    )
    await validateConfig(config)

    // make every root path in the config relative for consistent snapshots aacross machines
    makeConfigPathsRelative(config)
    expect(config).toMatchSnapshot()
  })

  it('should indicate when there are conflicts', async () => {
    const config = await loadConfig(logger, { validate: false })

    await loadPluginConfig(
      logger,
      { id: 'conflicted test root', root: path.join(__dirname, 'files/conflicted') },
      config
    )

    expect(() => validateConfig(config)).rejects.toBeInstanceOf(ToolKitError)
    expect(config).toHaveProperty('hookTasks.build:ci.conflicting')
    expect(config).toHaveProperty('hookTasks.build:remote.conflicting')
    expect(config).toHaveProperty('hookTasks.build:local.conflicting')
  })

  it('should indicate when there are conflicts between plugins that are cousins in the tree', async () => {
    const config = await loadConfig(logger, { validate: false })

    await loadPluginConfig(
      logger,
      { id: 'conflicted test root', root: path.join(__dirname, 'files/cousins') },
      config
    )

    expect(() => validateConfig(config)).rejects.toBeInstanceOf(ToolKitError)
    expect(config).toHaveProperty('hookTasks.build:ci.conflicting')
    expect(config).toHaveProperty('hookTasks.build:remote.conflicting')
    expect(config).toHaveProperty('hookTasks.build:local.conflicting')
  })

  it('should succeed when conflicts are resolved', async () => {
    const config = await loadConfig(logger, { validate: false })

    await loadPluginConfig(
      logger,
      {
        id: 'resolved test root',
        root: path.join(__dirname, 'files/conflict-resolution')
      },
      config
    )

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
