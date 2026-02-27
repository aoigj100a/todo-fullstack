// apps/frontend/.eslintrc.js
module.exports = {
  extends: ['../../.eslintrc.js', 'next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // 前端特定覆寫規則
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    // 允許以底線開頭的未使用參數（intentionally unused）
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
