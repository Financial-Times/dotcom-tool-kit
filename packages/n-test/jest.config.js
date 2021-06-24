const base = require('../../jest.config.base')

module.exports = {
  ...base,
  globals: {
    'ts-jest': {
      tsconfig: {
        paths: {
          puppeteer: ['__mocks__/puppeteer']
        }
      }
    }
  }
}
