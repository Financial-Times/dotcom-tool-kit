import { describe, jest, it, expect, afterEach } from '@jest/globals'
import cloneDeep from 'lodash.clonedeep'
import * as path from 'path'
import { ToolKitError } from '../../error'
import { Config, config, validateConfig } from '../src/config'
import { loadPluginConfig } from '../src/plugin'

// Loading all the plugins can (unfortunately) take longer than the default 2s timeout
jest.setTimeout(15000)

const baseConfig = cloneDeep(config)

function makeRootRelative(thing: { root: string }) {
  thing.root = path.relative(process.cwd(), thing.root)
}

function makeConfigPathsRelative(config: Config) {
  makeRootRelative(config)

  for (const plugin of Object.values(config.plugins)) {
    makeRootRelative(plugin)
  }

  for (const assignment of Object.values(config.lifecycleAssignments)) {
    makeRootRelative(assignment.plugin)
  }

  for (const lifecycle of Object.values(config.lifecycles)) {
    if (lifecycle.plugin) makeRootRelative(lifecycle.plugin)
  }

  for (const task of Object.values(config.tasks)) {
    if (task.plugin) makeRootRelative(task.plugin)
  }
}

describe('cli', () => {
  afterEach(() => {
    // Need to reset the config object for each test
    Object.assign(config, cloneDeep(baseConfig))
  })

  it('should load plugins correctly', async () => {
    await loadPluginConfig({ id: 'successful test root', root: path.join(__dirname, 'files/successful') })
    await validateConfig(config, { checkInstall: false })

    // make every root path in the config relative for consistent snapshots aacross machines
    makeConfigPathsRelative(config)
    expect(config).toMatchSnapshot()
  })

  it('should indicate when there are conflicts', async () => {
    await loadPluginConfig({ id: 'conflicted test root', root: path.join(__dirname, 'files/conflicted') })

    expect(() => validateConfig(config, { checkInstall: false })).rejects.toBeInstanceOf(ToolKitError)
    expect(config).toHaveProperty('lifecycleAssignments.build:ci.conflicting')
    expect(config).toHaveProperty('lifecycleAssignments.build:remote.conflicting')
    expect(config).toHaveProperty('lifecycleAssignments.build:local.conflicting')
  })

  it('should succeed when conflicts are resolved', async () => {
    await loadPluginConfig({
      id: 'resolved test root',
      root: path.join(__dirname, 'files/conflict-resolution')
    })

    const validConfig = await validateConfig(config, { checkInstall: false }).catch((e) => {
      e.message += e.details
      throw e
    })
    expect(validConfig).not.toHaveProperty('lifecycleAssignments.build:local.conflicting')
    expect(validConfig.lifecycleAssignments['build:local'].tasks).toEqual([
      'webpack:development',
      'babel:development'
    ])
  })
})
