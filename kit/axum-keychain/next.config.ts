import type { NextConfig } from "next";

const backendPort = process.env.BACKEND_PORT ?? "8080";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: `http://127.0.0.1:${backendPort}/api/:path*`,
    },
  ],
};

export default nextConfig;
