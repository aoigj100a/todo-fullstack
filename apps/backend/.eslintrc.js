// apps/backend/.eslintrc.js
module.exports = {
  extends: ['../../.eslintrc.js'],
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['dist/**/*'],
  rules: {
    // 後端特定覆寫規則
    'no-console': [
      'warn',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],
  },
};
