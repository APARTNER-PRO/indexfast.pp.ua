import '../globals.css';
import { syne, dmSans } from '../fonts';
import React from 'react';
import { dictionaries } from '@/dictionaries';

export const metadata = {
  title: {
    default: 'IndexFast — Instant site indexing in Google',
    template: '%s | IndexFast',
  },
  description: 'Submit your website pages for Google indexing in minutes. Automatic indexing via Google Indexing API. Free start — 50 URLs/day.',
  keywords: ['google site indexing', 'google indexing api', 'speed up indexing', 'search console indexing', 'page indexing', 'seo indexing'],
  authors: [{ name: 'IndexFast', url: 'https://indexfast.pro' }],
  creator: 'IndexFast',
  publisher: 'IndexFast',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://indexfast.pro'),
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      uk: '/uk',
      ru: '/ru',
      de: '/de',
      es: '/es',
      fr: '/fr',
      pl: '/pl',
      pt: '/pt',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://indexfast.pro',
    siteName: 'IndexFast',
    title: 'IndexFast — Instant indexing of the site in Google',
    description: 'Submit your website pages for Google indexing in minutes. Automatic indexing via Google Search Console API.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'IndexFast - Instant site indexing in Google',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IndexFast — Instant indexing of the site in Google',
    description: 'Submit your website pages for Google indexing in minutes.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    manifest: '/site.webmanifest',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://indexfast.pro/#organization',
    name: 'IndexFast',
    url: 'https://indexfast.pro',
    logo: {
      '@type': 'ImageObject',
      url: 'https://indexfast.pro/apple-touch-icon.png',
      width: 180,
      height: 180,
    },
    sameAs: [
      'https://t.me/indexfastgoogle',
      'https://github.com/MatviyRoman',
      'https://linkedin.com/in/MatviyRoman',
    ],
    description: 'IndexFast is an automated SEO tool for instant website indexing in Google, Bing, and other search engines using the official Google Indexing API and IndexNow protocol.',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Roman Matviy',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'indexfastapp@gmail.com',
      url: 'https://t.me/indexfastgoogle',
      availableLanguage: ['English', 'Ukrainian'],
    },
  };

  const webSiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IndexFast',
    url: 'https://indexfast.pro',
    description: 'Automated SEO tool for instant website indexing in Google using the official Google Indexing API.',
    publisher: { '@id': 'https://indexfast.pro/#organization' },
    inLanguage: ['en', 'uk', 'de', 'es', 'fr', 'pl', 'pt', 'ru'],
  };

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Google Indexing Service',
    provider: {
      '@type': 'Organization',
      name: 'IndexFast',
      url: 'https://indexfast.pro',
    },
    name: 'IndexFast — Instant indexing in Google',
    image: ['https://indexfast.pro/apple-touch-icon.png'],
    description: 'Submit your website pages for Google indexing in minutes. Automatic indexing via Google Search Console API.',
    brand: {
      '@type': 'Brand',
      name: 'IndexFast',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '247',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: 0,
      highPrice: 49,
      offerCount: 3,
      offers: [
        {
          '@type': 'Offer',
          name: 'Start',
          price: 0,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://indexfast.pro/#pricing',
        },
        {
          '@type': 'Offer',
          name: 'PRO',
          price: 9.99,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://indexfast.pro/#pricing',
        },
        {
          '@type': 'Offer',
          name: 'Agency',
          price: 49,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://indexfast.pro/#pricing',
        },
      ],
    },
  };

  return (
    <html lang={lang} className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
