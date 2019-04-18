module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    jest: 'readonly',
    it: 'readonly',
    test: 'readonly',
    expect: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    describe: 'readonly',
  },
  rules: {
    'linebreak-style': [
      'error',
      'windows',
    ],
  },
};
