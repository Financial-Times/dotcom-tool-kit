const base = require('../../jest.config.base')
const path = require('path')

module.exports = {
  ...base,
  globals: {
    'ts-jest': {
      ...base.globals['ts-jest'],
      tsconfig: path.resolve(__dirname, './tsconfig.test.json')
    }
  }
}
