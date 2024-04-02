module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '@financial-times/eslint-config-next',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    '@dotcom-reliability-kit/eslint-config'
  ],
  rules: {
    // We use winston's logging instead
    'no-console': 'error',
    // Necessary to allow us to define arguments in a method that only subclasses use
    // https://github.com/typescript-eslint/typescript-eslint/issues/586#issuecomment-510099609
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    // Prettier sometimes like inserting semis
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'inline-type-imports'
      }
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']]
      }
    ]
  },
  settings: {
    'import/internal-regex': '^(@dotcom-tool-kit/|dotcom-tool-kit$)'
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
    },
    {
      files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
      // typescript handles undefined variables natively so this rule is not required
      // https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      rules: {
        'no-undef': 'off'
      }
    }
  ]
}
