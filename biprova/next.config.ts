import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.110'],
  experimental: {
    turbo: {
      root: __dirname,
    },
  },
};

export default nextConfig;
