import * as path from 'path'
import { loadPluginConfig } from '../src/plugin'
import { config } from '../src/config'
import simplifiedConfig from './files/simpleConfig.json'

const testRoot = path.join(__dirname, 'files')

jest.setTimeout(15000)

describe('cli', () => {
  it('should load plugins correctly', async () => {
    await loadPluginConfig({ id: 'test root', root: testRoot })

    expect(config).toMatchObject(simplifiedConfig)
  })
})
