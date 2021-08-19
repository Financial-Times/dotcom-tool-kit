import { describe, jest, it, expect } from '@jest/globals'
import * as path from 'path'
import { ToolKitError } from '../../error'
import { Config, loadConfig, validateConfig } from '../src/config'
import { loadPluginConfig } from '../src/plugin'

// Loading all the plugins can (unfortunately) take longer than the default 2s timeout
jest.setTimeout(15000)

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
  }

  for (const task of Object.values(config.tasks)) {
    if (task.plugin) makeRootRelative(task.plugin)
  }
}

describe('cli', () => {
  it('should load plugins correctly', async () => {
    const config = await loadConfig()

    await loadPluginConfig(
      { id: 'successful test root', root: path.join(__dirname, 'files/successful') },
      config
    )
    await validateConfig(config, { checkInstall: false })

    // make every root path in the config relative for consistent snapshots aacross machines
    makeConfigPathsRelative(config)
    expect(config).toMatchSnapshot()
  })

  it('should indicate when there are conflicts', async () => {
    const config = await loadConfig({ validate: false })

    await loadPluginConfig(
      { id: 'conflicted test root', root: path.join(__dirname, 'files/conflicted') },
      config
    )

    expect(() => validateConfig(config, { checkInstall: false })).rejects.toBeInstanceOf(ToolKitError)
    expect(config).toHaveProperty('hookTasks.build:ci.conflicting')
    expect(config).toHaveProperty('hookTasks.build:remote.conflicting')
    expect(config).toHaveProperty('hookTasks.build:local.conflicting')
  })

  it('should succeed when conflicts are resolved', async () => {
    const config = await loadConfig({ validate: false })

    await loadPluginConfig(
      {
        id: 'resolved test root',
        root: path.join(__dirname, 'files/conflict-resolution')
      },
      config
    )

    const validConfig = await validateConfig(config, { checkInstall: false }).catch((e) => {
      e.message += e.details
      throw e
    })
    expect(validConfig).not.toHaveProperty('hookTasks.build:local.conflicting')
    expect(validConfig.hookTasks['build:local'].tasks).toEqual(['WebpackDevelopment', 'BabelDevelopment'])
  })
})
