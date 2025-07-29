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
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://portal.aurafarming.co/api',
  },
  
  // API rewrites to DigitalOcean backend via api subdomain
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.aurafarming.co/:path*'
      }
    ]
  },
  
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