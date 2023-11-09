import { describe, it } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { RawPluginModule, importPlugin, validatePluginHooks, validatePluginTasks } from '../src/plugin'
import { unwrapValidated } from '@dotcom-tool-kit/types'

const pluginDir = path.join(__dirname, '../../../plugins')

function getPlugins() {
  const pluginDirContents = fs.readdirSync(pluginDir, { withFileTypes: true })
  return pluginDirContents.filter((plugin) => plugin.isDirectory()).map((plugin) => plugin.name)
}

describe.each(getPlugins())('%s integration test', (pluginName) => {
  const packagePath = path.join(pluginDir, pluginName)
  let plugin: RawPluginModule

  beforeAll(async () => {
    plugin = unwrapValidated(await importPlugin(packagePath)) as RawPluginModule
  })

  it('should have valid tasks', () => {
    const tasks = validatePluginTasks(plugin)
    expect(tasks).not.toHaveProperty('reasons')
  })

  it('should have valid hooks', () => {
    const hooks = validatePluginHooks(plugin)
    expect(hooks).not.toHaveProperty('reasons')
  })
})
