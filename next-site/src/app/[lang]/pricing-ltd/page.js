import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import { dictionaries } from '@/dictionaries';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.ltdPricing || {};

  const locales = { uk: 'uk_UA', de: 'de_DE', es: 'es_ES', fr: 'fr_FR', pl: 'pl_PL', pt: 'pt_PT', ru: 'ru_RU' };

  return {
    title: `${t.cardBadge || 'Lifetime Plan'} — IndexFast | One-time Payment`,
    description: t.subtitle || 'Get lifetime access to IndexFast. One-time payment, no recurring fees.',
    robots: { index: true, follow: true },
    alternates: {
      canonical: '/pricing-ltd',
    },
    openGraph: {
      type: 'website',
      locale: locales[lang] || 'en_US',
      url: 'https://indexfast.pro/pricing-ltd',
      title: `${t.cardBadge || 'Lifetime Plan'} — IndexFast`,
      description: t.subtitle || 'Get lifetime access to IndexFast. One-time payment, no recurring fees.',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  };
}

export default async function LifetimePricingPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.ltdPricing || {};

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

  const ltdFeatures = [
    t.features?.item1 || '3 websites',
    t.features?.item2 || 'Index up to 200 pages/day',
    t.features?.item3 || 'New/modified pages check (daily)',
    t.features?.item4 || 'Google auto indexing',
    t.features?.item5 || 'Unlimited URLs/website + Priority support',
  ];

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main>
        <RevealOnScroll />
        <section className="about-hero" style={{ minHeight: '50vh', paddingTop: 120 }}>
          <div className="hero-bg"></div>
          <div className="hero-grid-lines"></div>
          <div className="about-hero-inner">
            <div className="hero-eyebrow reveal">{t.badge || '💰 pricing'}</div>
            <h1 className="reveal">
              {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'Lifetime Access to<br /><em>All Features</em>'}
            </h1>
            <p className="hero-lead reveal">
              {t.subtitle || 'One-time payment, no recurring fees. Save big in the long run!'}
            </p>
          </div>
        </section>

        <section className="ltd-card-section">
          <div className="ltd-card">
            <div className="ltd-badge">{t.cardBadge || 'Lifetime Plan'}</div>
            <div style={{ marginBottom: 24 }}>
              <span className="ltd-price-old">{t.oldPrice || '$250'}</span>
              <span className="ltd-price-currency">{t.currency || '$'}</span>
              <span className="ltd-price-new">{t.newPrice || '120'}</span>
            </div>
            <ul className="ltd-features">
              {ltdFeatures.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <a href="/app/register" className="btn-purchase" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--green)', color: 'var(--black)', padding: '18px 36px', borderRadius: 100, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 0 30px rgba(0,255,136,0.3)', width: '100%', marginTop: 10 }}>
              {t.cta || 'Get Started'}
            </a>
            <p className="ltd-hurry">
              {t.hurry || 'Hurry!!! purchase now before price increases'}
            </p>
          </div>
        </section>

        <section className="content-section">
          <div className="content-grid">
            <h2 className="section-title reveal">{t.whyTitle || 'Why choose lifetime plan?'}</h2>
            <div className="features-grid">
              {(t.benefits || []).map((item, index) => (
                <div className={`feature-box reveal ${index % 2 === 1 ? 'reveal-delay-1' : ''}`} key={index}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section" style={{ background: 'var(--black)' }}>
          <div className="content-grid">
            <h2 className="section-title reveal">{t.comparisonTitle || 'Plan Comparison'}</h2>
            <div className="comparison-table-wrapper reveal">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>{t.comparisonHeaders?.type || 'Plan Type'}</th>
                    <th>{t.comparisonHeaders?.monthly || 'Monthly Plan (Basic)'}</th>
                    <th>{t.comparisonHeaders?.yearly || 'Yearly Plan (Basic)'}</th>
                    <th className="col-ltd">{t.cardBadge || 'Lifetime Plan'}</th>
                  </tr>
                </thead>
                <tbody>
                  {(t.comparison || []).map((row, i, arr) => (
                    <tr key={i}>
                      <td><strong>{row.feature}</strong></td>
                      <td>{row.basic}</td>
                      <td>{row.yearly}</td>
                      <td className="col-ltd">
                        {row.ltd.includes('was') || row.ltd.includes('був') ? <><span className="strikethrough">{t.oldPrice || '$250'}</span> {t.currency || '$'}{t.newPrice || '120'}</> : row.ltd}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="content-grid">
            <h2 className="section-title reveal">{t.faqTitle || 'Anything we can help you with?'}</h2>
            <div className="faq-list">
              {(t.faqs || []).map((item, index) => (
                <div className="faq-item reveal" key={index}>
                  <h3>🙋 {item.q}</h3>
                  <p dangerouslySetInnerHTML={{ __html: item.a }} />
                  {item.note && <p style={{ marginTop: 10 }}>{item.note}</p>}
                  {item.items && (
                    <ul>
                      {item.items.map((listItem, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: listItem }} />
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section" style={{ background: 'var(--black)' }}>
          <div className="content-grid">
            <div className="purchase-instructions reveal">
              <h2>{t.purchase?.title || 'How to purchase lifetime plan?'}</h2>
              <p>{t.purchase?.desc || 'Go to the IndexFast dashboard and purchase the lifetime plan directly from the billing page.'}</p>
              <a href={getLink('/#pricing')} className="btn-purchase" style={{ display: 'inline-block', width: 'auto' }}>
                {t.purchase?.cta || 'Check Subscription Plans'}
              </a>
              <p style={{ marginTop: 24, fontSize: '0.95rem' }}>
                {t.purchase?.contact ? <span dangerouslySetInnerHTML={{ __html: t.purchase.contact.replace('{link}', getLink('/contacts')) }} /> : <>Have some doubts? Feel free to <a href={getLink('/contacts')} style={{ color: 'var(--green)' }}>Contact Us</a></>}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}