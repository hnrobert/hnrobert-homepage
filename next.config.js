/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      {
        source: '/apple-touch-icon-precomposed.png',
        destination: '/assets/avatar.png',
        permanent: true,
      },
      {
        source: '/apple-touch-icon.png',
        destination: '/assets/avatar.png',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
