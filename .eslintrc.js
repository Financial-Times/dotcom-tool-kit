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
    'eqeqeq': 'error',
    'guard-for-in': 'error',
    // 'import/no-unresolved': [2, { commonjs: true, caseSensitive: true }],
    'import/no-named-as-default': 0,
    'indent': ['error', 'tab', {'SwitchCase': 1}],
    'new-cap': 'off',
    'no-caller': 'error',
    'no-console': 'error',
    'no-extend-native': 'error',
    'no-irregular-whitespace': 'error',
    'no-loop-func': 'error',
    'no-multi-spaces': 'error',
    'no-return-await': 'warn',
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'error',
    'no-var': 'error',
    'one-var': ['error', 'never'],
    'quotes': ['error', 'single'],
    'semi': ['warn', 'always'],
    'space-before-function-paren': ['error', 'always'],
    'wrap-iife': 'error'
  },
  overrides: []
}
