/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "ulibrary.s3.amazonaws.com" },
      { hostname: "loremflickr.com" },
      { hostname: "picsum.photos" },
    ],
  },
};

module.exports = nextConfig;
