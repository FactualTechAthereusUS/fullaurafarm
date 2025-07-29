/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment optimizations  
  trailingSlash: false,
  
  // Image optimization for Vercel
  images: {
    unoptimized: true
  },
  
  // React optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // No environment variables needed - API URL is hardcoded in components
  
  // Remove rewrites entirely - let frontend call backend directly
  // async rewrites() {
  //   return []
  // },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // API rewrites to DigitalOcean backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://portal.aurafarming.co/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig 