module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@financial-times/eslint-config-next',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // We use winston's logging instead
    'no-console': 'error',
    // Necessary to allow us to define arguments in a method that only subclasses use
    // https://github.com/typescript-eslint/typescript-eslint/issues/586#issuecomment-510099609
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        // We are still using CommonJS imports in our JS files
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['*.test.ts'],
      rules: {
        // It's alright to use rejection shorthand when mocking promises
        'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }]
      }
    }
  ]
}
