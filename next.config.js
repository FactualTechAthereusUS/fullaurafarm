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
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig 