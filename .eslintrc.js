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
    window: 'readonly',
    document: 'readonly',
  },
  rules: {
    'linebreak-style': [
      'error',
      'windows',
    ],
  },
};
