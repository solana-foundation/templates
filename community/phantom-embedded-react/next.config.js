/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      // Turbopack equivalent for webpack fallbacks
      // These modules are excluded from bundling
    },
  },
  // Keep webpack config for backward compatibility when using --webpack flag
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
}

module.exports = nextConfig
