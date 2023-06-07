module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: __dirname + '/tsconfig.json',
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.cjs'],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-underscore-dangle': 'off',
  },
};
