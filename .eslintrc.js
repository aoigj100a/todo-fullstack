// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended', // 新增這行來整合 Prettier
    'prettier', // 禁用與 prettier 衝突的規則
  ],
  plugins: ['prettier'],
  // 基本規則 - 所有人都必須遵守的
  rules: {
    // 錯誤防護 - 必要規則
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-unused-vars': 'warn',

    // 移除與 prettier 衝突的格式規則，讓 prettier 處理
    // indent: ['warn', 2], // 移除，由 prettier 處理
    // quotes: ['warn', 'single'], // 移除，由 prettier 處理
    // semi: ['warn', 'always'], // 移除，由 prettier 處理

    // React 相關 - 基本規則
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',

    // TypeScript 相關 - 基本規則
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // 允許特定註解來停用規則
    'eslint-disable': 'off',
    'eslint-disable-next-line': 'off',
    'prettier/prettier': 'error',
  },
  // 允許在特定目錄使用更嚴格的規則
  overrides: [
    {
      files: ['src/core/**/*.{ts,tsx}'],
      rules: {
        // 核心模組使用較嚴格的規則
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
        '@typescript-eslint/no-explicit-any': 'error',
        'no-console': 'error',
      },
    },
  ],
  // 提供彈性的環境設定
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
