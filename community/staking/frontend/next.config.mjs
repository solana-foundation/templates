/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly opt in to Turbopack so Next.js is happy even with a webpack field present.
  turbopack: {},
  webpack: (config) => {
    // Avoid bundling some optional node-only deps used by wallet tooling.
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  }
};

export default nextConfig;
