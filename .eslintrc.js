// .eslintrc.js
module.exports = {
    root: true,
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'prettier' // 必須放在最後
    ],
    plugins: ['prettier'],
    // 基本規則 - 所有人都必須遵守的
    rules: {
      // 錯誤防護 - 必要規則
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-unused-vars': 'warn',
      
      // 基本格式 - 寬鬆設定
      'indent': ['warn', 2],
      'quotes': ['warn', 'single'],
      'semi': ['warn', 'always'],
      
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
          'no-console': 'error'
        }
      }
    ],
    // 提供彈性的環境設定
    env: {
      browser: true,
      node: true,
      es2021: true
    }
  };