const base = require('./jest.config.base')

module.exports = {
  ...base,
  projects: ['<rootDir>/core/*', '<rootDir>/plugins/*', '<rootDir>/lib/*']
}
