'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dictionaries } from '@/dictionaries';
import { useState } from 'react';

export default async function FaqsPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.faqsPage || {};
  const faq = dict.faq || {};

  const getLink = (path) => {
    const isAnchor = path.startsWith('/#') || path.includes('#');
    if (isAnchor) {
      return lang === 'en' ? path : `/${lang}${path}`;
    }
    if (lang === 'en') {
      return path === '/' ? '/' : `${path}.html`;
    }
    return `/${lang}${path === '/' ? '/' : path + '.html'}`;
  };

  const faqs = faq.items || [
    { q: 'How quickly will Google index my pages?', a: 'Once submitted through IndexFast, Google typically indexes pages within 24-48 hours. It\'s normal a Googlebot scan can take anywhere from 2 weeks to several months.' },
    { q: 'How many URLs can I send for free?', a: 'Google provides a quota of 200 URLs per day for free through the Indexing API. IndexFast Free Plan automatically manages this quota. The quota can be expanded on Pro and Agency tariffs.' },
    { q: 'Is technical knowledge required?', a: 'For basic use, you only need to connect a Google Search Console account and specify a URL sitemap.xml. Step-by-step instructions are included. For automation through cron, you will need the basics knowledge of Linux.' },
    { q: 'Is this the official method? Google will not ban the site?', a: 'IndexFast uses only the official Google Indexing API. This is Google\'s recommended method for acceleration of indexing. No risks for your site.' },
    { q: 'What about other search engines (Bing, Naver)?', a: 'Yes, IndexFast also fully supports the IndexNow protocol. This means that your links are automatically sent not only to Google, but also to Bing, Naver, Seznam.cz and Yep at the same time.' },
    { q: 'What if my site is on WordPress / Webflow / another platform?', a: 'IndexFast works with any site that has a sitemap.xml — WordPress, Webflow, Wix, custom. If your site has a sitemap — IndexFast works with it.' },
    { q: 'How to set automatic start every day?', a: 'The Pro and Agency tariffs have a built-in planner. On the free plan, you can set up a cron task on the server - detailed instructions are in the documentation.' },
    { q: 'Is there a refund?', a: 'Yes, we provide a full refund guarantee within 14 days after payment if the service did not suit you. For inquiries, write to indexfastapp@gmail.com.' },
  ];

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main>
        <header style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111128 100%)', borderBottom: '1px solid rgba(0,255,136,0.1)', padding: '60px 0 40px' }}>
          <div className="container">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, fontSize: 13, color: '#888' }}>
              <a href={getLink('/')} style={{ color: '#666', textDecoration: 'none' }}>IndexFast</a>
              <span>/</span>
              <span>{t.title || 'FAQ'}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.03em' }}>
              {t.title || 'Frequently Asked Questions'}
            </h1>
            <p style={{ fontSize: 16, color: '#888', maxWidth: 600 }}>
              {t.subtitle || 'Everything you need to know about Google Search Console indexing and IndexFast.'}
            </p>
          </div>
        </header>
        <main style={{ padding: '48px 0 80px' }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="faq-meta" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 40, padding: 16, background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: 12, fontSize: 13, color: '#aaa' }}>
              <span><strong>{t.meta?.questions || '8 questions'}</strong> about indexing</span>
              <span><strong>Updated:</strong> {t.meta?.updated || '2026'}</span>
            </div>
            <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {faqs.map((item, index) => (
                <FaqItem key={index} question={item.q} answer={item.a} />
              ))}
            </div>
            <div className="cta-box" style={{ marginTop: 48, padding: 32, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 16, textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', marginBottom: 8 }}>
                {t.cta?.title || 'Still have questions?'}
              </h3>
              <p style={{ color: '#aaa', marginBottom: 20, fontSize: 14 }}>
                {t.cta?.text || 'Our support team is ready to help you with any questions about IndexFast.'}
              </p>
              <a href="mailto:indexfastapp@gmail.com" className="btn" style={{ display: 'inline-block', padding: '12px 28px', background: '#00ff88', color: '#0a0a0f', fontWeight: 700, borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
                {t.cta?.btn || 'Write to us'}
              </a>
            </div>
          </div>
        </main>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? 'open' : ''}`} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button
        className="faq-q"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', color: '#e0e0e0', fontSize: 16, fontWeight: 600, padding: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, textAlign: 'left', fontFamily: 'inherit', lineHeight: 1.4, transition: 'color 0.2s' }}
      >
        {question}
        <span className="faq-arrow" style={{ fontSize: 20, color: '#00ff88', flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      <div className="faq-a" role="region" style={{ maxHeight: open ? 600 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease, padding 0.35s ease' }}>
        <div style={{ padding: '0 20px 24px', color: '#b0b0b0', fontSize: 14, lineHeight: 1.8 }}>
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
