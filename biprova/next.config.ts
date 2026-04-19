import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.110'],
  turbopack: {
    root: __dirname,
  },
  // Güvenlik header'ları middleware.ts içinde dinamik olarak (nonce ile) ayarlanıyor.
};

export default nextConfig;
