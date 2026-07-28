import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { blogPosts } from '@/config/blogPosts';
import { dictionaries } from '@/dictionaries';

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export const metadata = {
  title: 'Blog — IndexFast | SEO and indexing articles',
  description: 'Useful articles about SEO, indexing in Google, sitemap.xml and promotion tools. Practical tips from the IndexFast team.',
};

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const slug = resolvedParams?.slug || '';
  const post = blogPosts.find((p) => p.slug === slug);
  const dict = dictionaries[lang] || dictionaries.en;

  if (!post) {
    return (
      <>
        <Header lang={lang} dict={dict} />
        <main style={{ padding: '120px 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Article not found</h1>
          <p style={{ color: 'var(--muted)' }}>The article you are looking for does not exist.</p>
        </main>
        <Footer lang={lang} dict={dict} />
      </>
    );
  }

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
        <article style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px 60px' }}>
          <header style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
              <span style={{ background: 'rgba(0,255,136,0.1)', color: 'var(--green)', fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: 100, fontFamily: 'var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {post.tag}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{post.readTime}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
              {post.title}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 600 }}>
              {post.desc}
            </p>
          </header>
          <div style={{ color: 'rgba(240,240,248,0.85)', lineHeight: 1.8, fontSize: '1.05rem' }}>
            <p>
              In this article, we will explore the key aspects of {post.title.toLowerCase()}.
              Our team has prepared practical tips and recommendations that will help you
              achieve better results in SEO.
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginTop: 48, marginBottom: 24, letterSpacing: '-0.02em' }}>
              Why this matters
            </h2>
            <p>
              Understanding the fundamentals of {post.tag.toLowerCase()} is essential for
              any website owner who wants to improve their search engine visibility.
              The strategies outlined in this guide are based on real-world experience
              and the latest best practices.
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginTop: 48, marginBottom: 24, letterSpacing: '-0.02em' }}>
              Key takeaways
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingLeft: 0 }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>→</span>
                <span>Focus on quality content that provides real value to your audience</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingLeft: 0 }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>→</span>
                <span>Use the right tools to automate repetitive SEO tasks</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingLeft: 0 }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>→</span>
                <span>Monitor your results and adjust your strategy accordingly</span>
              </li>
            </ul>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginTop: 48, marginBottom: 24, letterSpacing: '-0.02em' }}>
              Conclusion
            </h2>
            <p>
              By implementing the strategies discussed in this article, you can significantly
              improve your website&apos;s performance in search engines. Remember that SEO is
              a long-term process, but with the right approach, you can see results within weeks.
            </p>
          </div>
          <div style={{ marginTop: 48, padding: 32, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 16, textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', marginBottom: 8 }}>
              Ready to speed up your indexing?
            </h3>
            <p style={{ color: '#aaa', marginBottom: 20, fontSize: 14 }}>
              Start using IndexFast for free today.
            </p>
            <a href="/app/register" style={{ display: 'inline-block', padding: '12px 28px', background: '#00ff88', color: '#0a0a0f', fontWeight: 700, borderRadius: 10, textDecoration: 'none', fontSize: 14 }}>
              Get started for free →
            </a>
          </div>
        </article>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}