/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
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
      {
        source: '/(icon.svg|manifest.webmanifest|robots.txt|sitemap.xml|llms.txt|llms-full.txt)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog/:slug',
        destination: '/:slug',
        permanent: true,
      },
      {
        source: '/where-to-find-mushrooms-in-arc-raiders-the-ultimate-tactical-foraging-guide',
        destination: '/where-to-find-mushrooms-in-arc-raiders-ultimate-farming-guide',
        permanent: true,
      },
      {
        source: '/where-to-find-mushrooms-in-arc-raiders-tactical-foraging-guide',
        destination: '/where-to-find-mushrooms-in-arc-raiders-ultimate-farming-guide',
        permanent: true,
      },
      {
        source: '/arc-raiders-mushroom-guide-best-locations-farming-routes',
        destination: '/where-to-find-mushrooms-in-arc-raiders-ultimate-farming-guide',
        permanent: true,
      },
      {
        source: '/where-to-find-mushrooms-in-arc-raiders-fungal-farming-guide',
        destination: '/where-to-find-mushrooms-in-arc-raiders-ultimate-farming-guide',
        permanent: true,
      },
      {
        source: '/where-to-find-mushrooms-in-arc-raiders-tactical-guide',
        destination: '/where-to-find-mushrooms-in-arc-raiders-ultimate-farming-guide',
        permanent: true,
      },
      {
        source: '/where-to-find-mushrooms-in-arc-raiders-complete-guide',
        destination: '/where-to-find-mushrooms-in-arc-raiders-ultimate-farming-guide',
        permanent: true,
      },
      {
        source: '/arc-raiders-mushroom-location-guide-where-to-find-them',
        destination: '/where-to-find-mushrooms-in-arc-raiders-ultimate-farming-guide',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
