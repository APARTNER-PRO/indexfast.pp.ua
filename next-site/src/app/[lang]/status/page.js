import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dictionaries } from '@/dictionaries';

export default async function StatusPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.status || {};

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--green)', margin: '0 auto 16px', boxShadow: '0 0 20px var(--green)' }}></div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
            {t.title || 'All systems operational'}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
            {t.subtitle || 'IndexFast is running normally. All services are available.'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['Google Indexing API', 'IndexNow Protocol', 'Web Application', 'API Service'].map((name, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 4 }}>{name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }}></div>
                <span style={{ color: 'var(--green)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>Operational</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
