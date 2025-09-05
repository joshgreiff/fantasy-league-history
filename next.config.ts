import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  experimental: {
    // Ensure compatibility with Vercel
    serverComponentsExternalPackages: ['espn-fantasy-football-api']
  }
};

export default nextConfig;
