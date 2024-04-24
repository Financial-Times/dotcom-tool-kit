const base = require('../../jest.config.base')
const path = require('path')

module.exports = {
  ...base.config,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        ...base.tsJestConfig,
        tsconfig: path.resolve(__dirname, './tsconfig.test.json')
      }
    ]
  }
}
