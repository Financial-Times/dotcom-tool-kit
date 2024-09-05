const base = require('./jest.config.base')

/** @type {import('jest').Config} */
module.exports = {
  ...base.config,
  projects: ['<rootDir>/core/*', '<rootDir>/plugins/*', '<rootDir>/lib/*']
}
