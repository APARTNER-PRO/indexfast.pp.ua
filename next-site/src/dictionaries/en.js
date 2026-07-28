export default {
  nav: {
    howItWorks: 'How it works',
    forWhom: 'For whom',
    features: 'Advantages',
    pricing: 'Prices',
    faq: 'FAQ',
    signIn: 'Sign in',
    getStarted: 'Get started for free →',
    lang: 'EN ▾'
  },
  hero: {
    badge: '⚡ Google Indexing API & IndexNow',
    title: 'Your site in Google and Bing',
    titleEm: 'in 24 hours',
    titleEnd: 'not in weeks',
    subtitle: 'Stop waiting for Google to find your pages. IndexFast sends them for indexing instantly via the official API.',
    ctaPrimary: '🚀 Get started for free',
    ctaSecondary: 'See how it works ↓',
    stats: {
      indexed: 'URL indexed',
      customers: 'Satisfied customers',
      avgTime: 'Average indexing time',
      freePerDay: 'URL free/day'
    }
  },
  problem: {
    tag: 'Problem',
    title: 'Why is Google<br />ignoring your site?',
    items: [
      { icon: '⏳', title: 'Googlebot rarely crawls', desc: 'New pages can wait 2 weeks to several months for indexing — your competitors are overtaking you' },
      { icon: '📉', title: 'Traffic is not growing', desc: 'As long as the pages are not indexed, they are invisible to search engines and do not bring customers' },
      { icon: '🔧', title: 'Search Console is inconvenient', desc: 'Manually sending URLs one by one takes hours and API errors are scary without technical knowledge.' }
    ],
    compareTitle: 'Time to indexation',
    without: '❌ Without IndexFast',
    with: '✅ With IndexFast',
    withoutTime: '2–8 weeks',
    withTime: '24–48 hours',
    speedupLabel: 'in 14× faster',
    speedupSub: 'average indexing acceleration'
  },
  howItWorks: {
    tag: 'How it works',
    title: 'Three steps to<br />instant indexing',
    subtitle: 'Setup takes less than 10 minutes. No technical knowledge required.',
    steps: [
      { num: '01', icon: '🔑', title: 'Connect Search Console', desc: 'Download the JSON key of your Google Service Account and add it to IndexFast. Once is forever.' },
      { num: '02', icon: '🗺️', title: 'Specify the Sitemap URL', desc: 'Enter the address of your sitemap.xml or just the domain - IndexFast will find the sitemap automatically.' },
      { num: '03', icon: '⚡', title: 'Get the result', desc: 'All pages are sent for indexing. Get a detailed report and watch your traffic grow.' }
    ]
  },
  features: {
    tag: 'Advantages',
    title: 'Everything you need<br />for top positions',
    subtitle: 'We\'ve taken the complex Google Indexing API and turned it into a simple tool for any business.',
    items: [
      { icon: '🗺️', title: 'Sitemap Index support', desc: 'Automatically parses nested sitemaps of any depth - all URLs will be found and sent.' },
      { icon: '📊', title: 'Detailed log', desc: 'Each operation is recorded in a log file with time and status. You always know what happened and when.' },
      { icon: '🛡️', title: 'Quota management', desc: 'Automatically adheres to Google\'s 200 URL/day limit. No quota overrun errors.' },
      { icon: '⚙️', title: 'Flexible launch', desc: 'CLI, arguments, interactive mode. Run manually, via cron or CI/CD pipeline.' },
      { icon: '🚀', title: 'Official Google API', desc: 'Uses the official Google Indexing API - not gray schemes, but a legal and reliable method.' },
      { icon: '🔄', title: 'Automation', desc: 'Set up an automatic run via cron every day - new pages will be indexed by themselves.' }
    ]
  },
  integrations: {
    label: 'Works with any platform',
    footer: 'If your site has <strong>sitemap.xml</strong> — IndexFast works with it'
  },
  scroll: 'Scroll',
  period: 'per month',
  forWhom: {
    tag: 'For whom',
    title: 'IndexFast works<br />for any business',
    subtitle: 'From bloggers to agencies — if you have a website and want traffic from Google, IndexFast is for you.',
    items: [
      { emoji: '🛒', title: 'Online stores', desc: 'Hundreds and thousands of product pages that Google does not have time to scan. IndexFast guarantees that every new product gets into the search as quickly as possible.', tags: ['WooCommerce', 'OpenCart', 'Shopify', 'Prom.ua'] },
      { emoji: '✍️', title: 'Bloggers and media', desc: 'Publishing content every day? New articles appear in search the next morning, not weeks later. Your content ranks first while competitors wait.', tags: ['WordPress', 'Ghost', 'News portals'] },
      { emoji: '🏢', title: 'Business sites', desc: 'Updated services, added case studies, or changed prices? IndexFast instantly signals Google about changes. Up-to-date information in search results without delay.', tags: ['Landings', 'Corporate sites'] },
      { emoji: '🏠', title: 'Real estate and classifieds', desc: 'New objects appear every day. Buyers are searching on Google right now — every minute of indexation lag costs you a customer.', tags: ['DOM.RIA', 'Aggregators', 'Notice boards'] },
      { emoji: '🎯', title: 'SEO specialists and agencies', desc: 'Running multiple projects? The Agency plan lets you manage up to 50 client sites from one account and generate white-label reports.', tags: ['Multisite', 'White-label', 'API'] },
      { emoji: '🚀', title: 'Startups and SaaS', desc: 'Launching a new product? Fast indexing of your landing page and blog means first organic users with zero ad spend — already in the first week.', tags: ['Product Hunt', 'Landings', 'Blog'] }
    ]
  },
  testimonials: {
    tag: 'Customer reviews',
    title: 'They are already at the top of Google',
    items: [
      { badge: '+340% organic traffic', stars: '★★★★★', text: '"Launched an online store — 800 products, none of which were indexed for weeks. After IndexFast in 2 days all pages were in Google. Traffic increased 4 times in the first month."', name: 'Andriy Kovalenko', role: 'The owner of an online store, Kyiv', initials: 'AK' },
      { badge: 'Indexing in 18 hours', stars: '★★★★★', text: '"I blog about travel - I publish 3-4 articles a week. Previously, I waited up to 3 weeks for indexing. Now new ones the article is in circulation the very next morning. It was a game changer!"', name: 'Maryna Sydorenko', role: 'Blogger, 50k followers', initials: 'MS' },
      { badge: 'Customers from Google since the 1st week', stars: '★★★★★', text: '"We launched a landing page for a new product. Thanks to IndexFast, we received our first customers within a week organics SEO finally started working as it should."', name: 'Dmytro Petrenko', role: 'CEO of a SaaS startup', initials: 'DP' },
      { badge: 'Saving 8 hours/week', stars: '★★★★★', text: '"I serve 15 client sites. Used to spend hours manually submitting URLs through Search Console. Now one script handles all customers automatically every day."', name: 'Oleg Morozenko', role: 'SEO specialist, freelancer', initials: 'OHM' },
      { badge: 'Top 3 in 2 weeks', stars: '★★★★★', text: '"Law firm, very competitive niche. Updated the service pages - IndexFast sent them instantly. Through 2 weeks were in the top 3 for key queries. Unreal!"', name: 'Natalia Zakharenko', role: 'Marketer of a law firm', initials: 'NZ' },
      { badge: '200 → 2400 visitors/day', stars: '★★★★★', text: '"News portal - we publish 20+ materials per day. IndexFast in cron starts automatically. Traffic grew from 200 to 2,400 unique visitors per month."', name: 'Vasyl Kravchenko', role: 'Chief media editor', initials: 'VK' }
    ]
  },
  pricing: {
    tag: 'Pricing',
    title: 'Fair prices,<br />no hidden fees',
    subtitle: 'Get started for free. Pay only when you see result'
  },
  roi: {
    label: 'Calculator',
    title: 'How much you save<br />with IndexFast?',
    subtitle: 'Customize the settings for your business — and you\'ll see a real benefit in time and money.',
    fields: {
      pages: 'Pages on the site',
      newPages: 'New pages per month',
      rate: 'Your rate ($/hour)',
      minsPer: 'Minutes to manually index 1 URL'
    },
    results: {
      timeLabel: 'Time saved on indexing',
      costLabel: 'The cost of this time',
      speedLabel: 'Acceleration of indexing',
      speedValue: 'up to 14×',
      speedSub: 'from weeks to 24 hours',
      netBenefitLabel: 'Net benefit (savings - cost of PRO)',
      profitLabel: 'net profit per month',
      lossLabel: 'difference (consider PRO for larger volumes)',
      actionLabel: 'Get this benefit →'
    }
  },
  faq: {
    tag: 'FAQ',
    title: 'Frequently asked questions',
    items: [
      { q: 'How quickly will Google index my pages?', a: 'Once submitted through IndexFast, Google typically indexes pages within 24-48 hours. It\'s normal a Googlebot scan can take anywhere from 2 weeks to several months.' },
      { q: 'How many URLs can I send for free?', a: 'Google provides a quota of 200 URLs per day for free through the Indexing API. IndexFast Free Plan automatically manages this quota. The quota can be expanded on Pro and Agency tariffs.' },
      { q: 'Is technical knowledge required?', a: 'For basic use, you only need to connect a Google Search Console account and specify a URL sitemap.xml. Step-by-step instructions are included. For automation through cron, you will need the basics knowledge of Linux.' },
      { q: 'Is this the official method? Google will not ban the site?', a: 'IndexFast uses only the official Google Indexing API. This is Google\'s recommended method for acceleration of indexing. No risks for your site.' },
      { q: 'What about other search engines (Bing, Naver)?', a: 'Yes, IndexFast also fully supports the IndexNow protocol. This means that your links are automatically sent not only to Google, but also to Bing, Naver, Seznam.cz and Yep at the same time.' },
      { q: 'What if my site is on WordPress / Webflow / another platform?', a: 'IndexFast works with any site that has a sitemap.xml — WordPress, Webflow, Wix, custom. If your site has a sitemap — IndexFast works with it.' },
      { q: 'How to set automatic start every day?', a: 'The Pro and Agency tariffs have a built-in planner. On the free plan, you can set up a cron task on the server - detailed instructions are in the documentation.' },
      { q: 'Is there a refund?', a: 'Yes, we provide a full refund guarantee within 14 days after payment if the service did not suit you. For inquiries, write to indexfastapp@gmail.com.' }
    ]
  },
  blog: {
    tag: 'Useful materials',
    title: 'Read on our blog',
    subtitle: 'Practical guides on SEO, indexing and promotion in Google',
    introText: 'Practical guides on SEO, indexing and promotion in Google',
    readMore: 'All articles →',
    readArticle: 'Read the article →',
    articles: [
      { href: '/blog/yak-pryskoriti-indeksaciyu-saitu-v-google', tag: 'Indexing', readTime: '10 minutes of reading', title: 'How to speed up the indexing of your site in Google in 2025', desc: 'Step-by-step guide: from sitemap setup to Google Indexing API. Real methods that work.' },
      { href: '/blog/shcho-take-sitemap-xml', tag: 'SEO', readTime: '7 minutes of reading', title: 'What is sitemap.xml and why does your site need it?', desc: 'Full breakdown: structure, types, mistakes and how to properly set up a sitemap for Google.' },
    ],
    ctaArticles: {
      title: 'More articles on SEO and indexing',
      desc: 'Practical guides, cases and tips every week'
    }
  },
  cta: {
    tag: 'Get started now',
    title: 'While you are reading—',
    titleEm: 'competitors already in the top',
    subtitle: 'Join the 247+ sites already getting customers from Google with IndexFast.',
    trust: ['Free forever', 'No credit card', 'Official Google API']
  },
  footer: {
    brandDesc: 'Service for automatic indexing of site pages in Google through the official Google Indexing API.',
    product: {
      howItWorks: 'How it works',
      features: 'Advantages',
      pricing: 'Tariffs',
      docs: 'Documentation'
    },
    company: {
      about: 'About us',
      blog: 'Blog',
      affiliate: 'Partner program',
      contacts: 'Contacts'
    },
    support: {
      faq: 'FAQ',
      telegram: 'Telegram chat',
      email: 'Email support',
      status: 'Service status'
    },
    copyright: '© 2026 IndexFast. All rights reserved.',
    privacy: 'Privacy',
    terms: 'Conditions'
  },
  about: {
    eyebrow: 'Our team',
    title: 'We build tools<br />for <em>fast indexing</em>',
    lead: 'IndexFast is a Ukrainian team building tools for fast Google indexing. Learn about our mission, values, and the people behind the product.',
    mission: {
      label: 'Mission',
      title: 'Making SEO transparent and effective',
      text: 'We believe that every website deserves to be found on Google. Our mission is to simplify the indexing process and make professional SEO tools accessible to everyone. IndexFast is created to make SEO more transparent and effective. We use only official Google-recommended indexing methods.'
    },
    values: [
      { icon: '⚡', title: 'Speed', desc: 'We optimize every process to deliver results in hours, not weeks.' },
      { icon: '🛡️', title: 'Security', desc: 'Only official Google APIs. No risks for your site.' },
      { icon: '💎', title: 'Transparency', desc: 'Clear pricing, detailed logs, no hidden fees.' }
    ],
    team: {
      label: 'Team',
      title: 'The people behind IndexFast',
      sub: 'A small team with big ambitions for SEO'
    },
    teamCards: [
      { name: 'Roman Matviy', role: 'Founder & Developer', bio: 'Full-stack developer and SEO enthusiast. Built IndexFast to solve real indexing problems.' },
      { name: 'Andriy K.', role: 'SEO Specialist', bio: 'SEO specialist with 8+ years of experience. Ensures IndexFast follows best practices.' },
      { name: 'Maryna S.', role: 'Product Designer', bio: 'Creates intuitive interfaces that make complex SEO tasks simple for everyone.' }
    ],
    ukraine: {
      title: 'Proudly Ukrainian',
      text: 'IndexFast was born in Ukraine. We\'re committed to building world-class SEO tools while supporting our community and contributing to the tech ecosystem.',
      badge: '⚡ Made in Ukraine'
    },
    cta: {
      title: 'Ready to speed up your indexing?',
      subtitle: 'Join hundreds of sites already using IndexFast',
      btnPrimary: 'Get started for free →',
      btnSecondary: 'Contact us'
    }
  },
  contacts: {
    eyebrow: 'We are in touch',
    title: 'Contacts and <em>support</em>',
    lead: 'Have questions? Choose a convenient way to contact us — we will reply as soon as possible.',
    cards: [
      { icon: '✈', title: 'Telegram Support', desc: 'Fastest way to get an answer. Chat with the team.', link: 'Write to Telegram →' },
      { icon: '✉', title: 'Email', desc: 'For official inquiries and partnership proposals.', link: 'indexfastapp@gmail.com →' }
    ],
    seo: {
      title: 'Professional support for your SEO',
      text: 'Our support team consists of specialists who understand the Google Indexing API and technical SEO.',
      items: [
        'Setting up Google Cloud Console and service accounts.',
        'Solving \'Page is not indexed\' errors in Search Console.',
        'Optimizing API limits for large projects and online stores.',
        'Integrating IndexFast into your internal workflows.'
      ]
    },
    info: [
      { title: 'Working hours', desc: 'Mon–Fri 9:00–19:00 (Kyiv time). Agency plan: priority support 24/7.' },
      { title: 'Partnership', desc: 'SEO studio or developer? Referral program with payouts up to 20% per subscription.' },
      { title: 'Responsibility', desc: 'We use only official Google-recommended indexing methods.' }
    ]
  },
  faqsPage: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about Google Search Console indexing and IndexFast.',
    meta: {
      questions: '8 questions',
      updated: '2026'
    },
    cta: {
      title: 'Still have questions?',
      text: 'Our support team is ready to help you with any questions about IndexFast.',
      btn: 'Write to us'
    }
  },
  affiliate: {
    badge: 'Partner program',
    title: 'Earn with <em>IndexFast</em>',
    subtitle: 'Refer IndexFast to your audience and earn up to 20% recurring commission on every subscription.',
    ctaBtn: 'Become a partner →',
    cards: [
      { icon: '💰', title: 'Up to 20% commission', desc: 'Earn recurring commission on every subscription you refer. The more customers you bring, the more you earn.' },
      { icon: '📊', title: 'Real-time tracking', desc: 'Track your referrals, clicks, and earnings in real-time through our partner dashboard.' },
      { icon: '🎯', title: 'Marketing materials', desc: 'Get access to banners, logos, and ready-made content to promote IndexFast effectively.' }
    ]
  },
  status: {
    title: 'All systems operational',
    subtitle: 'IndexFast is running normally. All services are available.'
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    sections: [
      { title: 'Information We Collect', text: 'We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support.' },
      { title: 'How We Use Your Information', text: 'We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.' },
      { title: 'Data Security', text: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.' },
      { title: 'Contact Us', text: 'If you have any questions about this Privacy Policy, please contact us at indexfastapp@gmail.com.' }
    ]
  },
  terms: {
    title: 'Terms of Service',
    sections: [
      { title: 'Service Description', text: 'IndexFast provides automated website indexing services using the Google Indexing API and IndexNow protocol.' },
      { title: 'Subscription and Billing', text: 'We offer various subscription plans. Payment is processed securely through our payment providers. Subscriptions renew automatically unless canceled.' },
      { title: 'Refund Policy', text: 'We offer a full refund within 14 days of purchase if you are not satisfied with our service.' },
      { title: 'Contact Us', text: 'If you have any questions about these terms, please contact us at indexfastapp@gmail.com.' }
    ]
  },
  ltdPricing: {
    badge: '💰 Pricing',
    title: 'Lifetime Access to<br /><em>All Features</em>',
    subtitle: 'One-time payment, no recurring fees. Use forever!',
    cardBadge: 'Lifetime Plan',
    currency: '$',
    oldPrice: '250',
    newPrice: '120',
    cta: 'Get Started',
    hurry: 'Hurry!!! Purchase now before price increases',
    whyTitle: 'Why choose lifetime plan?',
    benefits: [
      { title: 'Unlimited access', desc: 'Unlimited access to all features available in the premium tiers without any monthly caps holding you back.' },
      { title: 'Free updates', desc: 'Free updates and new features. You will automatically receive all future improvements to the platform.' },
      { title: 'Premium support', desc: 'Premium support, always at your side. Get priority response from our dedicated support team.' },
      { title: 'One-time payment', desc: 'One-time payment, no surprises. Pay once and use the tool forever, completely eliminating subscription fatigue.' },
    ],
    comparisonHeaders: {
      type: 'Plan Type',
      monthly: 'Monthly Plan (Basic)',
      yearly: 'Yearly Plan (Basic)',
    },
    comparisonTitle: 'Plan Comparison',
    comparison: [
      { feature: 'Price', basic: '$10/month', yearly: '$96/year', ltd: '$120 (was $250)' },
      { feature: 'Total cost (2 years)', basic: '$240', yearly: '$192', ltd: '$120' },
      { feature: 'Access to features', basic: 'All', yearly: 'All', ltd: 'All' },
      { feature: 'Priority Support', basic: '✗', yearly: '✗', ltd: '✓' },
    ],
    features: {
      item1: '3 websites',
      item2: 'Index up to 200 pages/day',
      item3: 'New/modified pages check (daily)',
      item4: 'Google auto indexing',
      item5: 'Unlimited URLs/website + Priority support',
    },
    faqTitle: 'Anything we can help you with?',
    faqs: [
      { q: 'What happens if I just use Google Search Console?', a: 'Go to Google Search Console (search.google.com/search-console), add your site, submit a sitemap, and Google will eventually index your site.' },
      { q: 'Do you need access to my Search Console?', a: 'Yes. We request access to your Search Console to regularly check changes and automatically index pages.' },
      { q: 'How to check if my URLs are indexed?', a: 'Use the following methods to determine if a URL is indexed in Google.' },
      { q: 'Is my data secure?', a: 'Data protection is our top priority. We protect your data in accordance with GDPR and CCPA standards.' },
      { q: 'What is the refund policy?', a: 'Due to setup costs, we do not offer refunds. However, you can cancel anytime.' },
      { q: 'Can I change my plan later?', a: 'You can upgrade/downgrade your plan anytime through your billing portal.' },
    ],
    purchase: {
      title: 'How to purchase lifetime plan?',
      desc: 'Go to the IndexFast dashboard and purchase the lifetime plan directly from the billing page.',
      cta: 'Check Subscription Plans',
      contact: 'Have some doubts? Feel free to <a href="{link}" style="color: var(--green);">Contact Us</a>',
    }
  }
};