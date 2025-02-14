/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false, // 開發時檢查 ESLint
    dirs: ['src'] // 只檢查 src 目錄
  }
}

module.exports = nextConfig