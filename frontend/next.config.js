/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'ecom-backend-git-main-ashifreza72s-projects.vercel.app',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecom-backend-git-main-ashifreza72s-projects.vercel.app',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
