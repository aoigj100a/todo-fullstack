module.exports = {
    extends: ['../../.eslintrc.js'],
    parserOptions: {
      project: './tsconfig.json',
    },
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  };