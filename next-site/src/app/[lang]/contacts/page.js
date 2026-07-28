import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dictionaries } from '@/dictionaries';

export default async function ContactsPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.contacts || {};

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
        <section className="contacts-hero">
          <div className="hero-bg"></div>
          <div className="hero-grid"></div>
          <div className="hero-content">
            <div className="hero-eyebrow">{t.eyebrow || 'We are in touch'}</div>
            <h1>{t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'Contacts and <em>support</em>'}</h1>
            <p className="hero-lead">{t.lead || 'Have questions? Choose a convenient way to contact us — we will reply as soon as possible.'}</p>
          </div>
        </section>

        <main className="contacts-grid">
          <div className="contact-cards">
            <a href="https://t.me/indexfastgoogle" target="_blank" rel="noopener noreferrer" className="contact-card">
              <div className="card-icon">✈</div>
              <div className="card-title">{t.cards?.[0]?.title || 'Telegram Support'}</div>
              <div className="card-desc">{t.cards?.[0]?.desc || 'Fastest way to get an answer. Chat with the team.'}</div>
              <div className="card-link">{t.cards?.[0]?.link || 'Write to Telegram →'}</div>
            </a>
            <a href="mailto:indexfastapp@gmail.com" className="contact-card">
              <div className="card-icon">✉</div>
              <div className="card-title">{t.cards?.[1]?.title || 'Email'}</div>
              <div className="card-desc">{t.cards?.[1]?.desc || 'For official inquiries and partnership proposals.'}</div>
              <div className="card-link">{t.cards?.[1]?.link || 'indexfastapp@gmail.com →'}</div>
            </a>
          </div>
          <div className="seo-content">
            <h2>{t.seo?.title || 'Professional support for your SEO'}</h2>
            <p>{t.seo?.text || 'Our support team consists of specialists who understand the Google Indexing API and technical SEO.'}</p>
            <ul>
              {(t.seo?.items || ['Setting up Google Cloud Console and service accounts.', 'Solving \'Page is not indexed\' errors in Search Console.', 'Optimizing API limits for large projects and online stores.', 'Integrating IndexFast into your internal workflows.']).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </main>

        <section className="info-section">
          <div className="info-grid">
            {(t.info || [{ title: 'Working hours', desc: 'Mon–Fri 9:00–19:00 (Kyiv time). Agency plan: priority support 24/7.' }, { title: 'Partnership', desc: 'SEO studio or developer? Referral program with payouts up to 20% per subscription.' }, { title: 'Responsibility', desc: 'We use only official Google-recommended indexing methods.' }]).map((item, i) => (
              <div className="info-item" key={i}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
