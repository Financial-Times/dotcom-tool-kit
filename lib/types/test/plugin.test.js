/*
 * File must be JavaScript as ts-jest transform breaks instanceof Hook test in
 * instantiatePlugin function, apparently comparing two different versions of
 * the Hook constructor when going up the plugin's prototype chain.
 */
const { describe, it } = require('@jest/globals')
const fs = require('fs')
const path = require('path')
const { instantiatePlugin } = require('../lib')

const pluginDir = path.join(__dirname, '../../../plugins')

function getPlugins() {
  const pluginDirContents = fs.readdirSync(pluginDir, { withFileTypes: true })
  return pluginDirContents.filter((plugin) => plugin.isDirectory()).map((plugin) => plugin.name)
}

describe.each(getPlugins())('%s integration test', (plugin) => {
  const packagePath = path.join(pluginDir, plugin)
  it('should be a valid plugin', () => {
    const pluginPackage = require(packagePath)
    instantiatePlugin(pluginPackage)
  })
})
