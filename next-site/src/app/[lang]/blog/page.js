import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts } from '@/config/blogPosts';
import { dictionaries } from '@/dictionaries';

export const metadata = {
  title: 'Blog — IndexFast | SEO and indexing articles',
  description: 'Useful articles about SEO, indexing in Google, sitemap.xml and promotion tools. Practical tips from the IndexFast team.',
};

export default async function BlogPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;
  const t = dict.blog || {};

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

  const getBlogLink = (slug) => {
    if (lang === 'en') return `/blog/${slug}.html`;
    return `/${lang}/blog/${slug}.html`;
  };

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main>
        <header style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #111128 100%)', borderBottom: '1px solid rgba(0,255,136,0.1)', padding: '80px 60px 60px' }}>
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.2)', padding: '6px 16px', borderRadius: 100, marginBottom: 20, fontSize: '0.72rem', color: 'var(--green)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
              {t.tag || 'Blog'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 12 }}>
              {t.title || 'Blog — articles about SEO'}
            </h1>
            <p style={{ color: '#888', fontSize: 16, maxWidth: 520 }}>
              {t.intro || 'Practical guides on SEO, indexing and promotion in Google'}
            </p>
          </div>
        </header>
        <main style={{ padding: '48px 0 80px' }}>
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="blog-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {blogPosts.map((post, index) => (
                <a href={getBlogLink(post.slug)} key={index} style={{ textDecoration: 'none' }}>
                  <article className="blog-card" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, height: '100%', display: 'flex', flexDirection: 'column', gap: 14, transition: 'border-color 0.2s, transform 0.2s' }}>
                    <div className="blog-card-meta" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="blog-card-tag" style={{ background: 'rgba(0, 255, 136, 0.1)', color: 'var(--green)', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100, fontFamily: 'var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{post.tag}</span>
                      <span className="blog-card-readtime" style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{post.readTime}</span>
                    </div>
                    <h3 className="blog-card-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1.4, margin: 0 }}>{post.title}</h3>
                    <p className="blog-card-desc" style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, flex: 1 }}>{post.desc}</p>
                    <span className="blog-card-link" style={{ color: 'var(--green)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-display)', marginTop: 'auto' }}>
                      {t.readArticle || 'Read the article →'}
                    </span>
                  </article>
                </a>
              ))}
            </div>
          </div>
        </main>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
