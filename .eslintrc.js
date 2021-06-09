module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@financial-times/eslint-config-next',
    'prettier',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-console': 'off'
  }
}
