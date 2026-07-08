import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://127.0.0.1:8080/api/:path*",
    },
  ],
};

export default nextConfig;
