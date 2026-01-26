/** @type {import('next').NextConfig} */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://soeurise-backend-express:3001/api';
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '72.62.71.97',
      },
      {
        protocol: 'http',
        hostname: 'soeurise-backend-express',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: API_URL + '/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

