/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/default-image.jpg',
      },
    ],
  },
};

module.exports = nextConfig;
