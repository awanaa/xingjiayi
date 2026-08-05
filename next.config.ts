import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  allowedDevOrigins: ["192.168.10.82"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
