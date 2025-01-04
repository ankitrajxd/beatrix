/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    domains: ['beatrix-assets.s3.us-east-1.amazonaws.com'], // Add your external domain here
  },
};

module.exports = nextConfig;
