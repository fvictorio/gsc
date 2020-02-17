module.exports = {
  plugins: ['prettier'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-console': 'off',
    'prettier/prettier': 'warn',
    'import/no-dynamic-require': 'off',
    'import/no-unresolved': 'off',
    'global-require': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-shadow': 'off',
  },
}
