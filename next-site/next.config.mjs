/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'indexfast.pro',
      },
      {
        protocol: 'https',
        hostname: '*.indexfast.pro',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  trailingSlash: true,
  async rewrites() {
    const localePages = ['pricing-ltd', 'about', 'contacts', 'faqs', 'privacy-policy', 'terms', 'status', 'pricing', 'affiliate', 'blog'];
    const rewrites = [];

    // Add .html rewrites for each locale for all pages
    for (const page of localePages) {
      rewrites.push({ source: `/${page}.html`, destination: `/${page}` });
    }

    // Add .html rewrites for all locales
    const locales = ['uk', 'ru', 'de', 'es', 'fr', 'pl', 'pt'];
    for (const locale of locales) {
      for (const page of localePages) {
        rewrites.push({ source: `/${locale}/${page}.html`, destination: `/${locale}/${page}` });
      }
      // Blog posts with .html
      rewrites.push({ source: `/${locale}/blog/:slug*.html`, destination: `/${locale}/blog/:slug*` });
    }

    // Blog posts .html for default locale
    rewrites.push({ source: '/blog/:slug*.html', destination: '/blog/:slug*' });

    return rewrites;
  },
};

export default nextConfig;
