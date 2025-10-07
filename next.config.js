/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint during production builds if ESLint isn’t installed
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',            // front-end requests
        destination: 'http://10.118.170.209:3001/api/:path*', // backend IP & port
      },
    ];
  },
};

module.exports = nextConfig;
