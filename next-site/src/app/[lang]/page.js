import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pricingPlans } from '@/config/pricing';
import { dictionaries } from '@/dictionaries';
import HeroCounter from '@/components/HeroCounter';
import FaqAccordion from '@/components/FaqAccordion';
import RoiCalculator from '@/components/RoiCalculator';
import RevealOnScroll from '@/components/RevealOnScroll';

export default async function Home({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const dict = dictionaries[lang] || dictionaries.en;

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

  const faqs = [
    { q: 'How quickly will Google index my pages?', a: 'Once submitted through IndexFast, Google typically indexes pages within 24-48 hours. It\'s normal a Googlebot scan can take anywhere from 2 weeks to several months.' },
    { q: 'How many URLs can I send for free?', a: 'Google provides a quota of 200 URLs per day for free through the Indexing API. IndexFast Free Plan automatically manages this quota. The quota can be expanded on Pro and Agency tariffs.' },
    { q: 'Is technical knowledge required?', a: 'For basic use, you only need to connect a Google Search Console account and specify a URL sitemap.xml. Step-by-step instructions are included. For automation through cron, you will need the basics knowledge of Linux.' },
    { q: 'Is this the official method? Google will not ban the site?', a: 'IndexFast uses only the official Google Indexing API. This is Google\'s recommended method for acceleration of indexing. No risks for your site.' },
    { q: 'What about other search engines (Bing, Naver)?', a: 'Yes, IndexFast also fully supports the IndexNow protocol. This means that your links are automatically sent not only to Google, but also to Bing, Naver, Seznam.cz and Yep at the same time.' },
    { q: 'What if my site is on WordPress / Webflow / another platform?', a: 'IndexFast works with any site that has a sitemap.xml — WordPress, Webflow, Wix, custom. If your site has a sitemap — IndexFast works with it.' },
    { q: 'How to set automatic start every day?', a: 'The Pro and Agency tariffs have a built-in planner. On the free plan, you can set up a cron task on the server - detailed instructions are in the documentation.' },
    { q: 'Is there a refund?', a: 'Yes, we provide a full refund guarantee within 14 days after payment if the service did not suit you. For inquiries, write to indexfastapp@gmail.com.' },
  ];

  const testimonials = dict.testimonials?.items || [];

return (
     <>
       <Header lang={lang} dict={dict} />
       <main>
         <RevealOnScroll />
         <HeroCounter lang={lang} dict={dict} />
         <ProblemSection dict={dict} />
         <HowItWorksSection dict={dict} />
         <FeaturesSection dict={dict} />
         <IntegrationsSection dict={dict} />
         <ForWhomSection dict={dict} />
         <TestimonialsSection testimonials={testimonials} dict={dict} />
         <PricingSection plans={pricingPlans.get(lang)} getLink={getLink} dict={dict} lang={lang} />
         <RoiCalculator />
         <FaqSection faqs={faqs} dict={dict} />
         <BlogSection getLink={getLink} dict={dict} />
         <CtaSection getLink={getLink} dict={dict} />
       </main>
       <Footer lang={lang} />
     </>
   );
 }

function ProblemSection({ dict }) {
   const t = dict.problem || {};
   return (
     <section className="problem-section" aria-labelledby="problem-title">
       <div className="container">
         <div className="problem-grid">
           <div>
             <p className="section-tag reveal">{t.tag || 'Problem'}</p>
             <h2 className="section-title reveal" id="problem-title">
               {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'Why is Google<br />ignoring your site?'}
             </h2>
             <ul className="problem-list">
               {(t.items || []).map((item, i) => (
                 <li className={`problem-item reveal reveal-delay-${i + 1}`} key={i}>
                   <div className="problem-icon">{item.icon}</div>
                   <div className="problem-text">
                     <strong>{item.title}</strong>
                     <span>{item.desc}</span>
                   </div>
                 </li>
               ))}
             </ul>
           </div>
           <div className="visual-compare reveal">
             <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 24, fontSize: '1.1rem' }}>
               {t.compareTitle || 'Time to indexation'}
             </p>
             <div className="compare-item">
               <div className="compare-label">
                 <span>{t.without || '❌ Without IndexFast'}</span>
                 <span style={{ color: '#ff6b6b', fontWeight: 600 }}>{t.withoutTime || '2–8 weeks'}</span>
               </div>
               <div className="compare-bar-wrap">
                 <div className="compare-bar bar-bad"></div>
               </div>
             </div>
             <div className="compare-vs">VS</div>
             <div className="compare-item" style={{ marginTop: 16 }}>
               <div className="compare-label">
                 <span>{t.with || '✅ With IndexFast'}</span>
                 <span style={{ color: 'var(--green)', fontWeight: 600 }}>{t.withTime || '24–48 hours'}</span>
               </div>
               <div className="compare-bar-wrap">
                 <div className="compare-bar bar-good"></div>
               </div>
             </div>
             <div
               style={{
                 marginTop: 28,
                 padding: 20,
                 background: 'rgba(0,255,136,0.05)',
                 borderRadius: 12,
                 border: '1px solid rgba(0,255,136,0.15)',
                 textAlign: 'center',
               }}
             >
               <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--green)' }}>
                 {t.speedupLabel || 'in 14× faster'}
               </p>
               <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>
                 {t.speedupSub || 'average indexing acceleration'}
               </p>
             </div>
           </div>
         </div>
       </div>
     </section>
   );
 }

function HowItWorksSection({ dict }) {
   const t = dict.howItWorks || {};
   return (
     <section id="how-it-works" aria-labelledby="how-title">
       <div className="container">
         <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 0' }}>
           <p className="section-tag reveal">{t.tag || 'How it works'}</p>
           <h2 className="section-title reveal" id="how-title">
             {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'Three steps to<br />instant indexing'}
           </h2>
           <p className="section-sub reveal" style={{ margin: '0 auto' }}>
             {t.subtitle || 'Setup takes less than 10 minutes. No technical knowledge required.'}
           </p>
         </div>
         <div className="steps-grid reveal">
           {(t.steps || []).map((step, i) => (
             <div className="step" key={i}>
               <div className="step-num">{step.num}</div>
               <div className="step-icon">{step.icon}</div>
               <h3>{step.title}</h3>
               <p>{step.desc}</p>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
 }

function FeaturesSection({ dict }) {
   const t = dict.features || {};
   return (
     <section id="features" className="features-section" aria-labelledby="features-title">
       <div className="container">
         <div className="features-header">
           <div>
             <p className="section-tag reveal">{t.tag || 'Advantages'}</p>
             <h2 className="section-title reveal" id="features-title">
               {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'Everything you need<br />for top positions'}
             </h2>
           </div>
           <p className="section-sub reveal">
             {t.subtitle || 'We\'ve taken the complex Google Indexing API and turned it into a simple tool for any business.'}
           </p>
         </div>
         <div className="features-grid">
           {(t.items || []).map((item, i) => (
             <article className={`feature-card reveal ${i % 2 === 1 ? 'reveal-delay-1' : ''}`} key={i}>
               <div className="feature-icon">{item.icon}</div>
               <h3>{item.title}</h3>
               <p>{item.desc}</p>
             </article>
           ))}
         </div>
       </div>
     </section>
   );
 }

function IntegrationsSection({ dict }) {
   const t = dict.integrations || {};
   const integrations = [
    { name: 'WordPress', color: '#21759B', path: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.086 14.634L8.3 9.98h1.386l1.307 4.37 1.42-4.37h1.173l1.42 4.37 1.307-4.37H17.7l-2.614 6.654h-1.173l-1.42-4.24-1.42 4.24h-1.159z' },
    { name: 'PrestaShop', color: '#DF0067', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 14.5h-3v-5h3v5zm0-7h-3V7.5h3V9.5z' },
    { name: 'Wix', color: '#FAAD00', path: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 7l-2 6-1.5-4-1.5 4-2-6h1.5l1 3 1.5-4 1.5 4 1-3H16.5z' },
    { name: 'Shopify', color: '#96BF48', path: 'M15.337 4.77s-.104-.052-.26-.104c-.015-.522-.366-1.983-1.252-1.983-.026 0-.052 0-.078.003C13.5 2.374 13.1 2 12.725 2c-2.87 0-4.24 3.584-4.67 5.406-.99.307-1.697.523-1.787.55-.555.174-.572.19-.645.713C5.558 9.14 4 21 4 21l11.8 2.21L20 21.903 15.337 4.77zM12.96 5.89c-.625.191-1.307.402-2.002.614.385-1.48 1.118-2.196 1.764-2.472.18.434.26 1.055.238 1.858zm-.871-2.616c.111 0 .207.09.295.27-.698.33-1.447 1.17-1.76 2.85l-1.335.41C9.72 5.22 10.903 3.274 12.089 3.274zm.55 8.31l-.77-1.992s-.63.339-1.292.339c-1.043 0-1.097-.654-1.097-.817 0-.896 1.863-1.237 1.863-3.323 0-1.645-1.137-2.7-2.66-2.7-.065 0-.131.005-.196.012l-.42 1.296c.267-.1.542-.156.82-.156.86 0 1.05.643 1.05 1.06 0 1.126-1.732 1.175-1.732 3.183 0 1.636 1.157 2.03 1.89 2.03.745 0 1.544-.28 1.544-.28z' },
    { name: 'OpenCart', color: '#23ADEF', path: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14a3 3 0 110-6 3 3 0 010 6zm4.5-.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z' },
    { name: 'Laravel', color: '#FF2D20', path: 'M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.189.326L9.93 23.949a.316.316 0 01-.066.027.298.298 0 01-.066.017.296.296 0 01-.132-.044L.534 18.771a.378.378 0 01-.189-.326V2.382c0-.036.004-.072.014-.106a.344.344 0 01.015-.047.36.36 0 01.046-.07l.04-.04.05-.024L4.83.014a.378.378 0 01.378 0l4.32 2.494a.38.38 0 01.19.326v4.933l3.754-2.162a.38.38 0 01.378 0l4.323 2.493a.378.378 0 01.19.326V12.6l3.754-2.162v-4.93a.38.38 0 01.19-.326l4.322-2.494a.378.378 0 01.378 0l.004.002z' },
    { name: 'Joomla', color: '#F44321', path: 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm2.5 6.5h-5a1 1 0 000 2h5a1 1 0 000-2zm-5 3h5a1 1 0 010 2h-5a1 1 0 010-2zm2.5 3a1 1 0 010 2 1 1 0 010-2z' },
  ];

  const duplicated = [...integrations, ...integrations];

  return (
    <section className="integrations-section" aria-label="Supported platforms">
      <p className="integrations-label reveal">{t.label || 'Works with any platform'}</p>
      <div className="integrations-track-wrap reveal">
        <div className="integrations-track">
          {duplicated.map((integration, index) => (
            <div className="integration-card" key={index}>
              <div className="integration-logo">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d={integration.path} fill={integration.color} />
                </svg>
              </div>
              <span className="integration-name">{integration.name}</span>
            </div>
          ))}
        </div>
      </div>
<p className="integrations-footer reveal">
         {t.footer ? <span dangerouslySetInnerHTML={{ __html: t.footer }} /> : 'If your site has <strong>sitemap.xml</strong> — IndexFast works with it'}
       </p>
    </section>
  );
}

function ForWhomSection({ dict }) {
   const t = dict.forWhom || {};
   const audiences = t.items || [];

  return (
    <section className="forwhom-section" id="for-whom" aria-labelledby="forwhom-title">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
<p className="section-tag reveal">{t.tag || 'For whom'}</p>
           <h2 className="section-title reveal" id="forwhom-title">
             {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'IndexFast works<br />for any business'}
           </h2>
           <p className="section-sub reveal" style={{ margin: '0 auto' }}>
             {t.subtitle || 'From bloggers to agencies — if you have a website and want traffic from Google, IndexFast is for you.'}
           </p>
        </div>
        <div className="forwhom-grid">
          {audiences.map((item, index) => (
            <article className={`forwhom-card reveal ${index % 3 === 1 ? 'reveal-delay-1' : index % 3 === 2 ? 'reveal-delay-2' : ''}`} key={index}>
              <span className="forwhom-emoji">{item.emoji}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="forwhom-tags">
                {item.tags.map((tag) => (
                  <span className="forwhom-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials, dict }) {
   const t = dict.testimonials || {};
   return (
     <section aria-labelledby="reviews-title">
       <div className="container">
         <div style={{ textAlign: 'center', marginBottom: 0 }}>
           <p className="section-tag reveal">{t.tag || 'Customer reviews'}</p>
           <h2 className="section-title reveal" id="reviews-title">{t.title || 'They are already at the top of Google'}</h2>
         </div>
         <div className="testimonials-grid">
           {(t.items || testimonials).map((item, index) => (
             <article className={`testimonial reveal ${index % 3 === 1 ? 'reveal-delay-1' : index % 3 === 2 ? 'reveal-delay-2' : ''}`} key={index}>
               <div className="result-badge">{item.badge}</div>
               <div className="stars">{item.stars}</div>
               <p className="testimonial-text">{item.text}</p>
               <div className="testimonial-author">
                 <div className="author-avatar">{item.initials}</div>
                 <div>
                   <p className="author-name">{item.name}</p>
                   <p className="author-role">{item.role}</p>
                 </div>
               </div>
             </article>
           ))}
         </div>
       </div>
     </section>
   );
 }

function PricingSection({ plans, getLink, dict, lang }) {
   const t = dict.pricing || {};
   return (
     <section id="pricing" className="pricing-section" aria-labelledby="pricing-title">
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
            {plans.map((plan, index) => (
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
   );
 }

function FaqSection({ faqs, dict }) {
   const t = dict.faq || {};
   return (
     <section id="faq" aria-labelledby="faq-title">
       <div className="container">
         <div style={{ textAlign: 'center' }}>
           <p className="section-tag reveal">{t.tag || 'FAQ'}</p>
           <h2 className="section-title reveal" id="faq-title">{t.title || 'Frequently asked questions'}</h2>
         </div>
         <FaqAccordion items={faqs} />
       </div>
     </section>
   );
 }

function BlogSection({ getLink, dict }) {
   const t = dict.blog || {};
   const articles = t.articles || [
     { href: '/blog/yak-pryskoriti-indeksaciyu-saitu-v-google', tag: 'Indexing', readTime: '10 minutes of reading', title: 'How to speed up the indexing of your site in Google in 2025', desc: 'Step-by-step guide: from sitemap setup to Google Indexing API. Real methods that work.' },
     { href: '/blog/shcho-take-sitemap-xml', tag: 'SEO', readTime: '7 minutes of reading', title: 'What is sitemap.xml and why does your site need it?', desc: 'Full breakdown: structure, types, mistakes and how to properly set up a sitemap for Google.' },
   ];

   return (
     <section className="blog-section" aria-labelledby="blog-section-title">
       <div className="container">
         <p className="section-tag reveal">{t.tag || 'Useful materials'}</p>
         <h2 className="section-title reveal" id="blog-section-title" style={{ marginBottom: 12 }}>
           {t.title || 'Read on our blog'}
         </h2>
         <p className="blog-intro-text reveal">
           {t.introText || 'Practical guides on SEO, indexing and promotion in Google'}
         </p>
         <div className="blog-cards-grid reveal">
           {articles.map((article, index) => (
             <a href={getLink(article.href)} key={index} style={{ textDecoration: 'none' }}>
               <article className="blog-card">
                 <div className="blog-card-icon">⚡</div>
                 <div className="blog-card-meta">
                   <span className="blog-card-tag">{article.tag}</span>
                   <span className="blog-card-readtime">{article.readTime}</span>
                 </div>
                 <h3 className="blog-card-title">{article.title}</h3>
                 <p className="blog-card-desc">{article.desc}</p>
                 <span className="blog-card-link">
                   {t.readArticle || 'Read the article →'}
                 </span>
               </article>
             </a>
           ))}
           <a href={getLink('/blog')} key="all" style={{ textDecoration: 'none' }}>
             <article className="blog-card blog-card-cta">
               <div className="blog-card-icon">📚</div>
               <h3 className="blog-card-title">
                 {t.ctaArticles?.title || 'More articles on SEO and indexing'}
               </h3>
               <p className="blog-card-desc">
                 {t.ctaArticles?.desc || 'Practical guides, cases and tips every week'}
               </p>
               <span className="blog-card-link">
                 {t.readMore || 'All articles →'}
               </span>
             </article>
           </a>
         </div>
       </div>
     </section>
   );
 }

function CtaSection({ getLink, dict }) {
   const t = dict.cta || {};
   return (
     <section className="cta-section" aria-labelledby="cta-title">
       <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
         <p className="section-tag reveal">{t.tag || 'Get started now'}</p>
         <h2 className="section-title reveal" id="cta-title">
           {t.title ? <span dangerouslySetInnerHTML={{ __html: t.title }} /> : 'While you are reading—'}
           <br />
           competitors already <em>{t.titleEm || 'in the top'}</em>
         </h2>
         <p className="cta-sub reveal">
           {t.subtitle || 'Join the 247+ sites already getting customers from Google with IndexFast.'}
         </p>
         <div className="reveal">
           <a href="/app/register" className="btn-primary" style={{ display: 'inline-flex' }} aria-label="Get started for free">
             🚀 {t.btnPrimary || 'Get started for free →'}
           </a>
         </div>
         <p className="cta-trust reveal">
           {(t.trust || ['Free forever', 'No credit card', 'Official Google API']).map((item) => (
             <span key={item}>✓ {item}</span>
           ))}
         </p>
       </div>
     </section>
   );
 }
