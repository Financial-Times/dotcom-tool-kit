const base = require('./jest.config.base')

module.exports = {
  ...base,
  projects: ['<rootDir>/packages/*', '<rootDir>/plugins/*', '<rootDir>/lib/*']
}
