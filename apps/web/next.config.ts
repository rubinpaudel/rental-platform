import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Workspace UI package ships TS/TSX source (incl. "use client" files);
  // Next compiles it instead of consuming a prebuilt bundle.
  transpilePackages: ['@rental-platform/ui'],
  reactStrictMode: true,
};

export default nextConfig;
