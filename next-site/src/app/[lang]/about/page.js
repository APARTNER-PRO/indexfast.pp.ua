import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { dictionaries } from '@/dictionaries';

export default async function AboutPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.about || {};

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
        <section className="about-hero">
          <div className="hero-bg"></div>
          <div className="hero-grid-lines"></div>
          <div className="about-hero-inner">
            <div className="hero-content">
              <div className="hero-eyebrow">{t.eyebrow || 'Our team'}</div>
              <h1>
                {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'We build tools<br />for <em>fast indexing</em>'}
              </h1>
              <p className="hero-lead">
                {t.lead || 'IndexFast is a Ukrainian team building tools for fast Google indexing. Learn about our mission, values, and the people behind the product.'}
              </p>
            </div>
          </div>
        </section>

        <section className="mission-section">
          <div className="mission-grid">
            <div>
              <p className="mission-label">{t.mission?.label || 'Mission'}</p>
              <h2 className="mission-title">{t.mission?.title || 'Making SEO transparent and effective'}</h2>
              <p className="mission-text">
                {t.mission?.text?.split('.')[0] || 'We believe that every website deserves to be found on Google. Our mission is to simplify the indexing process and make professional SEO tools accessible to everyone.'}
              </p>
              <p className="mission-text">
                {t.mission?.text?.split('.')[1] || 'We use only official Google-recommended indexing methods.'}
              </p>
            </div>
            <div className="mission-values">
              {(t.values || [{ icon: '⚡', title: 'Speed', desc: 'We optimize every process to deliver results in hours, not weeks.' }, { icon: '🛡️', title: 'Security', desc: 'Only official Google APIs. No risks for your site.' }, { icon: '💎', title: 'Transparency', desc: 'Clear pricing, detailed logs, no hidden fees.' }]).map((value, i) => (
                <div className="value-row" key={i}>
                  <div className="value-icon">{value.icon}</div>
                  <div>
                    <div className="value-title">{value.title}</div>
                    <div className="value-desc">{value.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="team-section">
          <div className="team-header">
            <p className="team-label">{t.team?.label || 'Team'}</p>
            <h2 className="team-title">{t.team?.title || 'The people behind IndexFast'}</h2>
            <p className="team-sub">{t.team?.sub || 'A small team with big ambitions for SEO'}</p>
          </div>
          <div className="team-grid">
            {(t.teamCards || [{ name: 'Roman Matviy', role: 'Founder & Developer', bio: 'Full-stack developer and SEO enthusiast. Built IndexFast to solve real indexing problems.' }, { name: 'Andriy K.', role: 'SEO Specialist', bio: 'SEO specialist with 8+ years of experience. Ensures IndexFast follows best practices.' }, { name: 'Maryna S.', role: 'Product Designer', bio: 'Creates intuitive interfaces that make complex SEO tasks simple for everyone.' }]).map((member, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar">
                  <div className="avatar-bg" style={{ background: 'linear-gradient(135deg, var(--green), #00d4ff)' }}></div>
                  <span className="avatar-initials">{member.initials || member.name?.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="team-name">{member.name}</div>
                <div className="team-role">{member.role}</div>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ukraine-section">
          <div className="ukraine-inner">
            <div className="ua-flag">🇺🇦</div>
            <div className="ua-content">
              <h2>{t.ukraine?.title ? <span dangerouslySetInnerHTML={{ __html: t.ukraine.title }} /> : 'Proudly Ukrainian'}</h2>
              <p>
                {t.ukraine?.text || 'IndexFast was born in Ukraine. We\'re committed to building world-class SEO tools while supporting our community and contributing to the tech ecosystem.'}
              </p>
              <div className="ua-badge">{t.ukraine?.badge || '⚡ Made in Ukraine'}</div>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <h2>{t.cta?.title || 'Ready to speed up your indexing?'}</h2>
          <p>{t.cta?.subtitle || 'Join hundreds of sites already using IndexFast'}</p>
          <div className="cta-btns">
            <a href="/app/register" className="btn-green">{t.cta?.btnPrimary || 'Get started for free →'}</a>
            <a href={getLink('/contacts')} className="btn-ghost">{t.cta?.btnSecondary || 'Contact us'}</a>
          </div>
        </section>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
