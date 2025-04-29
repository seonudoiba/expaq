import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'expaq.starrstudio.pro', // Allow images from WordPress host
        port: '',
        pathname: '/wp-content/uploads/**', // Allow images specifically from the uploads directory
      },
       {
        protocol: 'https',
        hostname: 'secure.gravatar.com', // Allow Gravatar images for author avatars
        port: '',
        pathname: '/avatar/**',
      },
    ],
  },
};

export default nextConfig;
