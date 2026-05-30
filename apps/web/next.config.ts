import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Workspace packages ship TS/TSX source (incl. "use client" files);
  // Next compiles them instead of consuming a prebuilt bundle.
  transpilePackages: ['@rental-platform/ui', '@rental-platform/i18n'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
