const path = require('path')

const base = require('../../jest.config.base')

module.exports = {
  ...base,
  globals: {
    'ts-jest': {
      ...base.globals['ts-jest'],
      tsconfig: path.resolve(__dirname, './tsconfig.test.json')
    }
  }
}
