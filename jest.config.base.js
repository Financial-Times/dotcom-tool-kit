module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/*.+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.+/lib/', '/test/files'],
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.settings.json',
      isolatedModules: true
    }
  }
}
