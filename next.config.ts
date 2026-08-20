import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Next 15.3+ 默认只允许 q=75/100，灯箱大图用 q=82 会被 400 拒绝 → 放行
    qualities: [75, 82, 100],
  },
  allowedDevOrigins: ["192.168.10.82"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
