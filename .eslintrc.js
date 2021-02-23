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
  overrides: []
}
