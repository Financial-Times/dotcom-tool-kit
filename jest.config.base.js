module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/test/files'],
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.settings.json',
      isolatedModules: true
    }
  }
}
