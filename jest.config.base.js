module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.+/lib/', '/test/files'],
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.settings.json',
      isolatedModules: true
    }
  }
}
