/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  reactStrictMode: false,
}

module.exports = nextConfig
