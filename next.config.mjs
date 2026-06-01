/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/operators/releases',
        destination: '/api/operators',
      },
      {
        source: '/api/banners/releases',
        destination: '/api/banners',
      },
      {
        source: '/api/arknights/:path*',
        destination: 'https://arknights.global/api/:path*',
      },
      {
        source: '/api/yostar/:path*',
        destination: 'https://account.yo-star.com/api/:path*',
      },
    ]
  },
  // allowedDevOrigins: ['http://192.168.1.15:3000', 'http://localhost'],
}

export default nextConfig
