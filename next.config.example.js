/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for better development experience
  reactStrictMode: true,
  
  // Swap out React for Preact in production to reduce bundle size
  // swcMinify: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Internationalization
  // i18n: {
  //   locales: ['en', 'es', 'fr'],
  //   defaultLocale: 'en',
  // },
  
  // Redirects
  async redirects() {
    return [
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },
  
  // Rewrites (for API proxying, etc.)
  async rewrites() {
    return [
      // {
      //   source: '/api/proxy/:path*',
      //   destination: 'https://external-api.com/:path*',
      // },
    ];
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Environment variables exposed to the browser (must start with NEXT_PUBLIC_)
  env: {
    CUSTOM_ENV_VAR: process.env.CUSTOM_ENV_VAR,
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add custom webpack config here
    
    // Example: Add aliases
    // config.resolve.alias['@'] = path.join(__dirname, 'src');
    
    // Example: Exclude certain packages from bundling
    // if (!isServer) {
    //   config.externals.push('some-server-only-package');
    // }
    
    return config;
  },
  
  // Experimental features
  experimental: {
    // Server actions
    serverActions: {
      bodySizeLimit: '5mb',
      allowedOrigins: ['localhost:3000'],
    },
    
    // Instrumentation
    // instrumentationHook: true,
    
    // Partial Prerendering
    // ppr: true,
  },
  
  // Output configuration
  // output: 'standalone', // For Docker deployments
  
  // Compression
  compress: true,
  
  // PoweredBy header
  poweredByHeader: false,
  
  // Generate ETags
  generateEtags: true,
  
  // Page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // Trailing slash
  trailingSlash: false,
  
  // TypeScript configuration
  typescript: {
    // Ignore build errors (not recommended for production)
    // ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Ignore ESLint during builds (not recommended)
    // ignoreDuringBuilds: false,
    
    // Directories to lint
    dirs: ['app', 'pages', 'components', 'lib', 'src'],
  },
  
  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
