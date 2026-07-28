import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dictionaries } from '@/dictionaries';

export default async function PrivacyPolicyPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.privacyPolicy || {};

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 60px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 32 }}>
          {t.title || 'Privacy Policy'}
        </h1>
        <div style={{ color: 'rgba(240,240,248,0.8)', lineHeight: 1.8, fontSize: '1rem' }}>
          {(t.sections || [
            { title: 'Information We Collect', text: 'We collect information you provide directly to us...' },
            { title: 'How We Use Your Information', text: 'We use the information we collect...' },
            { title: 'Data Security', text: 'We implement appropriate security measures...' },
            { title: 'Contact Us', text: 'If you have any questions...' }
          ]).map((section, i) => (
            <div key={i}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
                {section.title}
              </h2>
              <p style={{ marginBottom: i < t.sections?.length - 1 ? 24 : 0 }}>{section.text}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
