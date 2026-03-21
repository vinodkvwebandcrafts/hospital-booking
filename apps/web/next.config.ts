import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@hospital-booking/shared-types'],
  reactStrictMode: true,
};

export default nextConfig;
