/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',   // your Unsplash URLs
      // add more if you use them:
      // 'plus.unsplash.com',
      // 'images.pexels.com',
      // 'cdn.your-cdn.com',
    ],
  },
};
module.exports = nextConfig;
