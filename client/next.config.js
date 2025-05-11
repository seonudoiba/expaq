/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "expaq.starrstudio.pro"
      },
    ],
  },
  /* config options here */
};

module.exports = nextConfig;