module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['terraform/**'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  // plugins: ['@typescript-eslint', 'react'],
  rules: {
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-magic-numbers': ['warn', { ignore: [0, 1], enforceConst: true }], // Temporal en warn
    'no-nested-ternary': 'error',
    complexity: ['warn', { max: 10 }], // Temporal en warn
    'max-lines': [
      'warn',
      { max: 300, skipBlankLines: true, skipComments: true }
    ], // Temporal en warn
    'max-params': ['warn', 4], // Temporal en warn
    'prefer-const': 'error',
    'no-var': 'error',
    'no-duplicate-imports': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn', // Temporal en warn
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      { allowExpressions: false }
    ], //Temporalmente se deja warn
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
