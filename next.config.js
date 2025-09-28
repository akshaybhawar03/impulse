/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend se request
        destination: "http://192.168.1.100:5000/api/:path*", 
        // yaha backend ka IP & port dalna hai
      },
    ];
  },
};

module.exports = nextConfig;
