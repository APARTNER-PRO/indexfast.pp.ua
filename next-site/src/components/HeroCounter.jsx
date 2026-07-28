'use client';

import { useState, useEffect, useRef } from 'react';

export default function HeroCounter({ lang, dict }) {
  const t = dict.hero || {};
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounter(setCount1, 1240000, '+');
            animateCounter(setCount2, 247);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getLink = (path) => {
    if (lang === 'en') return path;
    return `/${lang}${path === '/' ? '/' : path}`;
  };

  return (
    <header className="hero" role="banner" ref={ref}>
      <div className="hero-grid" aria-hidden="true"></div>
      <div className="hero-badge" aria-label="New technology">{t.badge || '⚡ Google Indexing API & IndexNow'}</div>
      <h1>
        {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'Your site in Google and Bing<br /><em>in 24 hours</em><br />not in weeks'}
      </h1>
      <p className="hero-sub">
        {t.subtitle || 'Stop waiting for Google to find your pages. IndexFast sends them for indexing instantly via the official API.'}
      </p>
      <div className="hero-actions">
        <a href="/app/register" className="btn-primary" aria-label="Get started for free">
          🚀 {t.ctaPrimary || 'Get started for free'}
        </a>
        <a href={getLink('/#how-it-works')} className="btn-secondary" aria-label="See how it works">
          {t.ctaSecondary || 'See how it works ↓'}
        </a>
      </div>
      <div className="hero-stats" aria-label="Service statistics">
        <div className="stat">
          <div className="stat-num">{count1 > 0 ? count1.toLocaleString('en-US') + '+' : '0+'}</div>
          <div className="stat-label">{t.stats?.indexed || 'URL indexed'}</div>
        </div>
        <div className="stat">
          <div className="stat-num">{count2 > 0 ? count2.toLocaleString('en-US') : '0'}</div>
          <div className="stat-label">{t.stats?.customers || 'Satisfied customers'}</div>
        </div>
        <div className="stat">
          <div className="stat-num">{t.stats?.avgTime ? <span dangerouslySetInnerHTML={{ __html: t.stats.avgTime }} /> : '24 hours'}</div>
          <div className="stat-label">{t.stats?.avgTime || 'Average indexing time'}</div>
        </div>
        <div className="stat">
          <div className="stat-num">200</div>
          <div className="stat-label">{t.stats?.freePerDay || 'URL free/day'}</div>
        </div>
      </div>
<div className="scroll-hint" aria-hidden="true">
         <div className="scroll-line"></div>
         <span>{dict.scroll || 'Scroll'}</span>
       </div>
    </header>
  );
}

function animateCounter(setCount, target, suffix = '') {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    setCount(Math.floor(current));
  }, 25);
}
