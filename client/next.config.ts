import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
