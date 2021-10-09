const base = require('../../jest.config.base')

module.exports = {
  ...base,
  collectCoverage: true,
  globals: {
    'ts-jest': {
      tsconfig: {
        paths: {
          herokuClient: ['__mocks__/herokuClient']
        }
      }
    }
  }
}
