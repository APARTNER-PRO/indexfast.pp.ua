'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header({ lang, dict }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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

  // Generate language switcher link - preserve current page path
  const getLangLink = (targetLang) => {
    if (targetLang === lang) return '#';
    const cleanPath = pathname.replace(/^\/[a-z]{2}\//, '/').replace(/^\/[a-z]{2}$/, '/').replace(/\.html$/, '');
    
    if (targetLang === 'en') {
      return cleanPath === '/' ? '/' : `${cleanPath}.html`;
    } else {
      return cleanPath === '/' ? `/${targetLang}/` : `/${targetLang}${cleanPath}.html`;
    }
  };

  return (
    <nav id="navbar" role="navigation" aria-label="Головне меню">
      <Link href={lang === 'en' ? '/' : `/${lang}/`} className="logo" aria-label="IndexFast — Головна">
        Index<span>Fast</span>
      </Link>
      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li><a href={getLink('/#how-it-works')}>{dict.nav?.howItWorks}</a></li>
        <li><a href={getLink('/#for-whom')}>{dict.nav?.forWhom}</a></li>
        <li><a href={getLink('/#features')}>{dict.nav?.features}</a></li>
        <li><a href={getLink('/#pricing')}>{dict.nav?.pricing}</a></li>
        <li><a href={getLink('/#faq')}>{dict.nav?.faq}</a></li>
        <li className="mobile-auth">
          <a href="/app/login" className="mobile-login">{dict.nav?.signIn}</a>
          <a href="/app/register" className="mobile-register">{dict.nav?.getStarted}</a>
        </li>
      </ul>
<div className="nav-actions">
        <div className="nav-lang-dropdown">
          <button className="nav-lang-btn">{dict.nav?.lang}</button>
          <div className="nav-lang-menu">
            <a href={getLangLink('en')} className={lang === 'en' ? 'active' : ''}>English</a>
            <a href={getLangLink('uk')} className={lang === 'uk' ? 'active' : ''}>Українська</a>
            <a href={getLangLink('es')} className={lang === 'es' ? 'active' : ''}>Español</a>
            <a href={getLangLink('pt')} className={lang === 'pt' ? 'active' : ''}>Português</a>
            <a href={getLangLink('ru')} className={lang === 'ru' ? 'active' : ''}>Русский</a>
            <a href={getLangLink('de')} className={lang === 'de' ? 'active' : ''}>Deutsch</a>
            <a href={getLangLink('fr')} className={lang === 'fr' ? 'active' : ''}>Français</a>
            <a href={getLangLink('pl')} className={lang === 'pl' ? 'active' : ''}>Polski</a>
          </div>
        </div>
<a href="/app/login" className="nav-login">{dict.nav?.signIn}</a>
        <a href="/app/register" className="nav-cta">{dict.nav?.getStarted}</a>
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Відкрити меню"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}
