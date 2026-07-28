'use client';

import { dictionaries } from '@/dictionaries';

export default function Footer({ lang, dict = dictionaries[lang] || dictionaries.en }) {
  const t = dict.footer || {};

  // Helper to generate correct internal links based on lang with .html extension
  // Anchor links (#) should not have .html appended
  const getLink = (path) => {
    const isAnchor = path.startsWith('/#') || path.includes('#');
    if (isAnchor) {
      return lang === 'en' ? path : `/${lang}${path}`;
    }
    if (lang === 'en') {
      return path === '/' ? '/' : `${path}.html`;
    }
    return `/${lang}${path === '/' ? '.html' : path + '.html'}`;
  };

  return (
    <footer role="contentinfo">
      <div className="footer-grid">
        <div className="footer-brand">
          <a href={getLink('/')} className="logo">
            Index<span>Fast</span>
          </a>
          <p>{t.brandDesc || 'Service for automatic indexing of site pages in Google through the official Google Indexing API.'}</p>
        </div>
        <div className="footer-col">
          <p className="footer-title">{t.product?.label || 'Product'}</p>
          <ul>
            <li><a href={getLink('/#how-it-works')}>{t.product?.howItWorks || 'How it works'}</a></li>
            <li><a href={getLink('/#features')}>{t.product?.features || 'Advantages'}</a></li>
            <li><a href={getLink('/#pricing')}>{t.product?.pricing || 'Tariffs'}</a></li>
            <li><a href="/docs/">{t.product?.docs || 'Documentation'}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <p className="footer-title">{t.company?.label || 'Company'}</p>
          <ul>
            <li><a href={getLink('/about')}>{t.company?.about || 'About us'}</a></li>
            <li><a href={getLink('/blog')}>{t.company?.blog || 'Blog'}</a></li>
            <li><a href={getLink('/affiliate')}>{t.company?.affiliate || 'Partner program'}</a></li>
            <li><a href={getLink('/contacts')}>{t.company?.contacts || 'Contacts'}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <p className="footer-title">{t.support?.label || 'Support'}</p>
          <ul>
            <li><a href={getLink('/#faq')}>{t.support?.faq || 'FAQ'}</a></li>
            <li><a href="https://t.me/indexfastgoogle" target="_blank" rel="noopener noreferrer">{t.support?.telegram || 'Telegram chat'}</a></li>
            <li><a href="mailto:indexfastapp@gmail.com">{t.support?.email || 'Email support'}</a></li>
            <li><a href={getLink('/status')}>{t.support?.status || 'Service status'}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t.copyright || '© 2026 IndexFast. All rights reserved.'}</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href={getLink('/privacy-policy')}>{t.privacy || 'Privacy'}</a>
          <a href={getLink('/terms')}>{t.terms || 'Conditions'}</a>
        </div>
      </div>
      <button id="backToTop" className="back-to-top" aria-label="Up">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </footer>
  );
}
