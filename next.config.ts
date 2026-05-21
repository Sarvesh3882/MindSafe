import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Suppress hydration warnings caused by browser extensions
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
