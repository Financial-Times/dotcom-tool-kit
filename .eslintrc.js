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
      files: ['*.test.ts'],
      rules: {
        // TODO ivo: Revisit this once Command types have been reified?
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}
