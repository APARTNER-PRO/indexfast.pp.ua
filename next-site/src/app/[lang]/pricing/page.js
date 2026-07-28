import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RevealOnScroll from '@/components/RevealOnScroll';
import { pricingPlans } from '@/config/pricing';
import { dictionaries } from '@/dictionaries';

export default async function PricingPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.pricing || {};

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
    <>
      <Header lang={lang} dict={dict} />
      <main>
        <RevealOnScroll />
        <section className="pricing-section" style={{ paddingTop: 120 }} aria-labelledby="pricing-title">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 0 }}>
              <p className="section-tag reveal">{t.tag || 'Pricing'}</p>
              <h2 className="section-title reveal" id="pricing-title">
                {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'Fair prices,<br />no hidden fees'}
              </h2>
              <p className="section-sub reveal" style={{ margin: '16px auto 0' }}>
                {t.subtitle || 'Get started for free. Pay only when you see result'}
              </p>
            </div>
            <div className="pricing-grid">
              {pricingPlans.map((plan, index) => (
                <div className={`pricing-card reveal ${plan.isPopular ? 'featured' : ''} ${index % 3 === 1 ? 'reveal-delay-1' : index % 3 === 2 ? 'reveal-delay-2' : ''}`} key={plan.id}>
                  <p className="pricing-tier">{plan.name}</p>
                  <p className="pricing-price">
                    <span>{plan.priceCurrency}</span>
                    {plan.price}
                  </p>
                  <p className="pricing-period">{dict.period || 'per month'}</p>
                  <ul className="pricing-features">
                    {plan.features.map((feature, i) => (
                      <li key={i} className={feature.included ? '' : 'disabled'}>
                        {feature.text}
                      </li>
                    ))}
                  </ul>
                  <a href={plan.ctaLink} className="btn-plan" target="_blank" rel="noopener noreferrer">
                    {plan.ctaText}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '80px 40px', background: 'var(--dark)' }}>
          <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 16 }}>
              {t.customTitle || 'Need a custom solution?'}
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32 }}>
              {t.customDesc || 'For large projects and agencies we offer individual tariffs with personal manager and dedicated support.'}
            </p>
            <a href={getLink('/contacts')} className="btn-primary" style={{ display: 'inline-flex' }}>
              {t.customCta || 'Contact us →'}
            </a>
          </div>
        </section>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
