module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@financial-times/eslint-config-next',
    'prettier',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // This is a CLI application so we want to be logging
    'no-console': 'off'
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        // We are still using CommonJS imports in our JS files
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
}
