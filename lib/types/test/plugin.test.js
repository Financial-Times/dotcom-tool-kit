/*
 * File must be JavaScript as ts-jest transform breaks instanceof Hook test in
 * instantiatePlugin function, apparently comparing two different versions of
 * the Hook constructor when going up the plugin's prototype chain.
 */
const { describe, it } = require('@jest/globals')
const path = require('path')
const { instantiatePlugin } = require('../lib')

// TODO: come up with a better way to get list of plugins to test – perhaps by
// separating plugins (like prettier) from libraries (like error) and apps (like
// cli) by putting them into different directories in the monorepo?
describe.each([
  'babel',
  'circleci',
  'circleci-heroku',
  'eslint',
  'frontend-app',
  'heroku',
  'husky-hook',
  'husky-npm',
  'lint-staged',
  'lint-staged-npm',
  'mocha',
  'next-router',
  'node',
  'npm',
  'n-test',
  'package-json-hook',
  'prettier',
  'upload-assets-to-s3',
  'webpack'
])('%s integration test', (plugin) => {
  const packagePath = path.join(__dirname, `../../${plugin}`)
  it('should be a valid plugin', () => {
    const pluginPackage = require(packagePath)
    instantiatePlugin(pluginPackage)
  })
})
