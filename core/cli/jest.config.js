const base = require('../../jest.config.base')

module.exports = {
  ...base,
  globals: {
    'ts-jest': {
      tsconfig: {
        ...base.globals['ts-jest'].tsconfig,
        resolveJsonModule: true
      }
    }
  }
}
