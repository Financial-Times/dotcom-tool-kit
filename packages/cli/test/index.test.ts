import cloneDeep from 'lodash.clonedeep'
import * as path from 'path'
import { ToolKitError } from '../../error'
import { config, validateConfig } from '../src/config'
import { loadPluginConfig } from '../src/plugin'
import simpleConfig from './files/successful/simpleConfig.json'

// Loading all the plugins can (unfortunately) take longer than the default 2s timeout
jest.setTimeout(15000)

const baseConfig = cloneDeep(config)

describe('cli', () => {
  afterEach(() => {
    // Need to reset the config object for each test
    Object.assign(config, cloneDeep(baseConfig))
  })

  it('should load plugins correctly', async () => {
    await loadPluginConfig({ id: 'successful test root', root: path.join(__dirname, 'files/successful') })

    validateConfig(config)
    expect(config).toMatchObject(simpleConfig)
  })

  it('should indicate when there are conflicts', async () => {
    await loadPluginConfig({ id: 'conflicted test root', root: path.join(__dirname, 'files/conflicted') })

    expect(() => validateConfig(config)).toThrow(ToolKitError)
    expect(config).toHaveProperty('lifecycles.build:ci.conflicting')
    expect(config).toHaveProperty('lifecycles.build:deploy.conflicting')
    expect(config).toHaveProperty('lifecycles.build:local.conflicting')
  })

  it('should succeed when conflicts are resolved', async () => {
    await loadPluginConfig({
      id: 'resolved test root',
      root: path.join(__dirname, 'files/conflict-resolution')
    })

    validateConfig(config)
    expect(config).not.toHaveProperty('lifecycles.build:local.conflicting')
    expect(config.lifecycles['build:local'].commands).toEqual(['webpack:development', 'babel:development'])
  })
})
