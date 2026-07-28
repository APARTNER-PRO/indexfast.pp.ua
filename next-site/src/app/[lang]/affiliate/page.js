import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dictionaries } from '@/dictionaries';

export default async function AffiliatePage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.affiliate || {};

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
        <section style={{ padding: '120px 60px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.08) 0%, transparent 70%)' }}></div>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.2)', padding: '6px 16px', borderRadius: 100, marginBottom: 24, fontSize: '0.72rem', color: 'var(--green)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
              {t.badge || 'Partner program'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 20 }}>
              {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'Earn with <em style="font-style: normal; background: linear-gradient(135deg, var(--green) 0%, #00d4ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">IndexFast</em>'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 40px' }}>
              {t.subtitle || 'Refer IndexFast to your audience and earn up to 20% recurring commission on every subscription.'}
            </p>
            <a href="mailto:indexfastapp@gmail.com" className="btn-primary" style={{ display: 'inline-flex' }}>
              {t.ctaBtn || 'Become a partner →'}
            </a>
          </div>
        </section>

        <section style={{ padding: '80px 60px', background: 'var(--dark)' }}>
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {(t.cards || [{ icon: '💰', title: 'Up to 20% commission', desc: 'Earn recurring commission on every subscription you refer. The more customers you bring, the more you earn.' }, { icon: '📊', title: 'Real-time tracking', desc: 'Track your referrals, clicks, and earnings in real-time through our partner dashboard.' }, { icon: '🎯', title: 'Marketing materials', desc: 'Get access to banners, logos, and ready-made content to promote IndexFast effectively.' }]).map((card, i) => (
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 36 }} key={i}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{card.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>{card.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
