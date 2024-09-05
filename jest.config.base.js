const tsJestConfig = {
  tsconfig: 'tsconfig.settings.json',
  isolatedModules: true
}
module.exports.tsJestConfig = tsJestConfig

/** @type {import('jest').Config} */
module.exports.config = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/*.+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/.+/lib/', '/test/files'],
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', tsJestConfig]
  }
}
