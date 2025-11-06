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
        destination: 'http://192.168.9.157:3001/api/:path*', // backend IP & port
      },
    ];
  },
};

module.exports = nextConfig;
