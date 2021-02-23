module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es6: true
  },
  extends: [],
  parserOptions: {
    ecmaVersion: 2018,
    // Support for ESM is not tied to an ES version
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts']
      }
    }
  },
  rules: {
    'no-console': 'error',
    // 'import/no-unresolved': [2, { commonjs: true, caseSensitive: true }],
    'import/no-named-as-default': 0
  },
  overrides: []
}
