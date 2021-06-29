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
      files: ['jest.config.js'],
      rules: {
        // Jest config files don't support ES6 module imports
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
}
