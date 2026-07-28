export const dictionaries = {
  en: {
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
      badge: '💰 pricing',
      title: 'Lifetime Access to<br /><em>All Features</em>',
      subtitle: 'One-time payment, no recurring fees. Use forever!',
      cardBadge: 'Lifetime Plan',
      currency: '$',
      oldPrice: '250',
      newPrice: '120',
      cta: 'Get Started',
      hurry: 'Hurry!!! purchase now before price increases',
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
        {
          q: 'What happens if I just use Google Search Console?',
          a: 'Go to Google Search Console (search.google.com/search-console), add your site, submit a sitemap, and Google will eventually index your site. Easy. Sometimes, depending on the project / website, things related to URL indexing (and / or deindexing) for SEO can be quite a headache. And that\'s why Indexfast.pro, the SEO tool for indexing URLs on Google that saves you all the headaches, has been born.',
          note: 'Our tool automatically checks which URLs on your website are indexed, or not. In case some pages are not indexed and should be, Indexfast.pro will take care of getting them indexed at lightning speed. All without you having to do anything at all. Just sit and see URLs get indexed!',
        },
        {
          q: 'Do you need access to my Search Console?',
          a: 'Yes. We request access to your Search Console in order to regularly check sitemap changes and index your web pages automatically. Rest assured, You can revoke access at any moment and all your Search Console data is removed from our servers permanently.',
          items: ['Check URL indexation', 'Index URLs'],
        },
        {
          q: 'How to check if my URLs are indexed?',
          a: 'To determine if a URL is indexed on Google, you can use the following methods:',
          items: [
            '<strong>Google Search:</strong> Enter "site:https://yourwebsite.com/your-url" in Google\'s search bar. If the URL appears in search results, it\'s indexed.',
            '<strong>Google Search Console:</strong> Access the Index Coverage Report in Google Search Console to check URL indexing status. You can also use the URL inspector tool.',
            '<strong>Google Analytics (or similar tools):</strong> Monitor organic traffic to the URL. If traffic is generated from Google (no ads), it\'s likely indexed.',
            '<strong>Indexfast.pro:</strong> Our SEO software checks daily if the URLs of your website(s) are indexed on Google, or not.',
          ],
          note: 'By employing these methods, you can ascertain whether a specific URL is indexed on Google.',
        },
        { q: 'Is my data secure?', a: 'Protecting the data you trust to Index Fast is our first priority. We protect your data at rest and in transit at the highest standards specified by GDP or CCPA.' },
        {
          q: 'What is the refund policy?',
          a: 'Due to the costs associated with setting up an account, we do not offer refunds. However, you are free to cancel at any time through self-service before your subscription is renewed.',
          note: 'we would highly appreciate if you will give us some feedback, and we\'ll see what we can do to sort it out.',
        },
        { q: 'Can I change my plan later?', a: 'You are free to upgrade/downgrade your plan anytime as per your requirement from your self serving billing portal.' },
      ],
      purchase: {
        title: 'How to purchase lifetime plan?',
        desc: 'Go to the IndexFast dashboard and purchase the lifetime plan directly from the billing page.',
        cta: 'Check Subscription Plans',
        contact: 'Have some doubts? Feel free to <a href="{link}" style="color: var(--green);">Contact Us</a>',
      },
    }
  },
  uk: {
    nav: {
      howItWorks: 'Як це працює',
      forWhom: 'Для кого',
      features: 'Переваги',
      pricing: 'Ціни',
      faq: 'FAQ',
      signIn: 'Увійти',
      getStarted: 'Почати безкоштовно →',
      lang: 'UK ▾'
    },
    hero: {
      badge: '⚡ Google Indexing API & IndexNow',
      title: 'Ваш сайт у Google і Bing',
      titleEm: 'за 24 години',
      titleEnd: 'а не тижнями',
      subtitle: 'Перестаньте чекати, поки Google знайде ваші сторінки. IndexFast відправляє їх на індексацію миттєво через офіційний API.',
      ctaPrimary: '🚀 Почати безкоштовно',
      ctaSecondary: 'Як це працює ↓',
      stats: {
        indexed: 'URL проіндексовано',
        customers: 'Задоволених клієнтів',
        avgTime: 'Середній час індексації',
        freePerDay: 'URL безкоштовно/день'
      }
    },
    problem: {
      tag: 'Проблема',
      title: 'Чому Google ігнорує<br />ваш сайт?',
      items: [
        { icon: '⏳', title: 'Googlebot індексує рідко', desc: 'Нові сторінки можуть чекати індексації від 2 тижнів до декількох місяців — ваші конкуренти випереджають вас' },
        { icon: '📉', title: 'Трафік не зростає', desc: 'Доки сторінки не проіндексовані, вони невидимі для пошукових систем і не приносять клієнтів' },
        { icon: '🔧', title: 'Search Console незручна', desc: 'Вручну відправляти URL по одному займає години, а помилки API лякають без технічних знань.' }
      ],
      compareTitle: 'Час до індексації',
      without: '❌ Без IndexFast',
      with: '✅ З IndexFast',
      withoutTime: '2–8 тижнів',
      withTime: '24–48 годин',
      speedupLabel: 'в 14× швидше',
      speedupSub: 'середнє прискорення індексації'
    },
    howItWorks: {
      tag: 'Як це працює',
      title: 'Три кроки до<br />миттєвої індексації',
      subtitle: 'Налаштування займає менше 10 хвилин. Технічні знання не потрібні.',
      steps: [
        { num: '01', icon: '🔑', title: 'Підключіть Search Console', desc: 'Завантажте JSON-ключ вашого Google Service Account і додайте його в IndexFast. Разом і назавжди.' },
        { num: '02', icon: '🗺️', title: 'Вкажіть URL sitemap', desc: 'Введіть адресу вашого sitemap.xml або просто домен — IndexFast знайде sitemap автоматично.' },
        { num: '03', icon: '⚡', title: 'Отримайте результат', desc: 'Всі сторінки відправлені на індексацію. Отримайте детальний звіт і спостерігайте за зростанням трафіку.' }
      ]
    },
    features: {
      tag: 'Переваги',
      title: 'Все, що потрібно<br />для топ-позицій',
      subtitle: 'Ми взяли складний Google Indexing API і перетворили його на простий інструмент для будь-якого бізнесу.',
      items: [
        { icon: '🗺️', title: 'Підтримка Sitemap Index', desc: 'Автоматично парсить вкладені sitemaps будь-якої глибини — всі URL будуть знайдені і відправлені.' },
        { icon: '📊', title: 'Детальний лог', desc: 'Кожна операція записується в лог-файл з часом і статусом. Ви завжди знаєте, що сталося і коли.' },
        { icon: '🛡️', title: 'Управління квотою', desc: 'Автоматично дотримується ліміту Google 200 URL/день. Ні помилок перевищення квоти.' },
        { icon: '⚙️', title: 'Гнучкий запуск', desc: 'CLI, аргументи, інтерактивний режим. Запускайте вручну, через cron або CI/CD пайплайн.' },
        { icon: '🚀', title: 'Офіційний Google API', desc: 'Використовує офіційний Google Indexing API — не сірі схеми, а законний і надійний метод.' },
        { icon: '🔄', title: 'Автоматизація', desc: 'Налаштуйте автоматичний запуск через cron кожного дня — нові сторінки будуть індексуватися самі.' }
      ]
    },
integrations: {
       label: 'Працює з будь-якою платформою',
       footer: 'Якщо у вашого сайту є <strong>sitemap.xml</strong> — IndexFast з ним працює'
     },
     scroll: 'Гортати',
     period: 'на місяць',
    forWhom: {
      tag: 'Для кого',
      title: 'IndexFast працює<br />для будь-якого бізнесу',
      subtitle: 'Від блогерів до агентств — якщо у вас є сайт і ви хочете трафік з Google, IndexFast для вас.',
      items: [
        { emoji: '🛒', title: 'Інтернет-магазини', desc: 'Сотні і тисячі товарних сторінок, на індексацію яких Google не встигає. IndexFast гарантує, що кожен новий товар потрапить до пошуку якомога швидше.', tags: ['WooCommerce', 'OpenCart', 'Shopify', 'Prom.ua'] },
        { emoji: '✍️', title: 'Блогери та ЗМІ', desc: 'Щодня публікуєте контент? Нові статті з\'являються в пошуку вже наступного ранку, а не через тижні. Ваш контент займає перші місця, поки конкуренти чекають.', tags: ['WordPress', 'Ghost', 'Новинні портали'] },
        { emoji: '🏢', title: 'Бізнес-сайти', desc: 'Оновили послуги, додали кейси або змінили ціни? IndexFast миттєво сигналізує Google про зміни. Актуальна інформація в результатах пошуку без затримок.', tags: ['Лендінги', 'Корпоративні сайти'] },
        { emoji: '🏠', title: 'Нерухомість та класифікатори', desc: 'Нові об\'єкти з\'являються щодня. Покупці шукають в Google прямо зараз — кожна хвилина затримки індексації коштує вам клієнта.', tags: ['DOM.RIA', 'Агрегатори', 'Дошки оголошень'] },
        { emoji: '🎯', title: 'SEO-спеціалісти та агентства', desc: 'Керуєте кількома проєктами? Тариф Agency дозволяє керувати до 50 клієнтських сайтів з одного облікового запису та генерувати white-label звіти.', tags: ['Мультисайт', 'White-label', 'API'] },
        { emoji: '🚀', title: 'Стартапи та SaaS', desc: 'Запускаєте новий продукт? Швидка індексація вашого лендінгу та блогу означає перших органічних користувачів з нульовим бюджетом на рекламу — вже на першому тижні.', tags: ['Product Hunt', 'Лендінги', 'Блог'] }
      ]
    },
    testimonials: {
      tag: 'Відгуки клієнтів',
      title: 'Вже на верші Google',
      items: [
        { badge: '+340% органічного трафіку', stars: '★★★★★', text: '"Запустила інтернет-магазин — 800 товарів, жоден з яких не індексувався тижнями. Після IndexFast за 2 дні всі сторінки були в Google. Трафік зріс у 4 рази за перший місяць."', name: 'Андрій Коваленко', role: 'Власник інтернет-магазину, Київ', initials: 'АК' },
        { badge: 'Індексація за 18 годин', stars: '★★★★★', text: '"Я блогер про подорожі — публікую 3-4 статті на тиждень. Раніше чекала індексації до 3 тижнів. Тепер нова стаття в обігу вже наступного ранку. Це змінило всі правила гри!"', name: 'Марина Сидоренко', role: 'Блогер, 50к підписників', initials: 'МС' },
        { badge: 'Клієнти з Google з 1-го тижня', stars: '★★★★★', text: '"Запустили лендінг для нового продукту. Завдяки IndexFast отримали перших клієнтів протягом тижня. Органічне SEO нарешті працює так, як і повинно."', name: 'Дмитро Петренко', role: 'CEO SaaS стартапу', initials: 'ДП' },
        { badge: 'Економія 8 годин/тиждень', stars: '★★★★★', text: '"Обслуговую 15 клієнтських сайтів. Раніше витрачав години на ручне відправлення URL через Search Console. Тепер один скрипт обробляє всіх клієнтів автоматично щодня."', name: 'Олег Морозенко', role: 'SEO-спеціаліст, фрілансер', initials: 'ОМ' },
        { badge: 'Топ-3 за 2 тижні', stars: '★★★★★', text: '"Юридична фірма, дуже конкурентна ніша. Оновив сторінки послуг — IndexFast відправив їх миттєво. За 2 тижні були в топ-3 за ключовими запитами. Невагомо!"', name: 'Наталія Захаренко', role: 'Маркетолог юридичної фірми', initials: 'НЗ' },
        { badge: '200 → 2400 відвідувачів/день', stars: '★★★★★', text: '"Новинний портал — публікуємо 20+ матеріалів на день. IndexFast в cron запускається автоматично. Трафік зріс з 200 до 2 400 унікальних відвідувачів на місяць."', name: 'Василь Кравченко', role: 'Головний редактор ЗМІ', initials: 'ВК' }
      ]
    },
    pricing: {
      tag: 'Ціни',
      title: 'Справедливі ціни,<br />без прихованих платежів',
      subtitle: 'Почніть безкоштовно. Платіть тільки тоді, коли бачите результат'
    },
    roi: {
      label: 'Калькулятор',
      title: 'Скільки ви економите<br />з IndexFast?',
      subtitle: 'Налаштуйте параметри для вашого бізнесу — і ви побачите реальну вигоду в часі та грошах.',
      fields: {
        pages: 'Сторінок на сайті',
        newPages: 'Нових сторінок на місяць',
        rate: 'Ваш тариф (грн/годину)',
        minsPer: 'Хвилин на ручну індексацію 1 URL'
      },
      results: {
        timeLabel: 'Час, заощаджений на індексації',
        costLabel: 'Вартість цього часу',
        speedLabel: 'Прискорення індексації',
        speedValue: 'до 14×',
        speedSub: 'з тижнів до 24 годин',
        netBenefitLabel: 'Чистий дохід (заощадження - вартість PRO)',
        profitLabel: 'чистий прибуток на місяць',
        lossLabel: 'різниця (розгляньте PRO для більших обсягів)',
        actionLabel: 'Отримати вигоду →'
      }
    },
    faq: {
      tag: 'FAQ',
      title: 'Часті запитання',
      items: [
        { q: 'Як швидко Google проіндексує мої сторінки?', a: 'Після відправки через IndexFast Google зазвичай індексує сторінки протягом 24-48 годин. Нормально, якщо сканування Googlebot займає від 2 тижнів до декількох місяців.' },
        { q: 'Скільки URL я можу відправляти безкоштовно?', a: 'Google надає квоту 200 URL на день безкоштовно через Indexing API. IndexFast Free Plan автоматично керує цією квотою. Квоту можна розширити на тарифах Pro і Agency.' },
        { q: 'Чи потрібні технічні знання?', a: 'Для базового використання достатньо підключити обліковий запис Google Search Console і вказати URL sitemap.xml. Інструкції покроково включені. Для автоматизації через cron знадобляться базові знання Linux.' },
        { q: 'Це офіційний метод? Google не забанить сайт?', a: 'IndexFast використовує тільки офіційний Google Indexing API. Це рекомендований Google метод прискорення індексації. Ніяких ризиків для вашого сайту.' },
        { q: 'А як щодо інших пошукових систем (Bing, Naver)?', a: 'Так, IndexFast також повністю підтримує протокол IndexNow. Це означає, що ваші посилання автоматично відправляються не тільки в Google, але й в Bing, Naver, Seznam.cz і Yep одночасно.' },
        { q: 'А якщо мій сайт на WordPress / Webflow / іншій платформі?', a: 'IndexFast працює з будь-яким сайтом, в якого є sitemap.xml — WordPress, Webflow, Wix, кастомний. Якщо у вашого сайту є sitemap — IndexFast з ним працює.' },
        { q: 'Як налаштувати автоматичний запуск щодня?', a: 'На тарифах Pro і Agency є вбудований планувальник. На безкоштовному плані ви можете налаштувати cron-завдання на сервері — детальні інструкції в документації.' },
        { q: 'Чи є повернення коштів?', a: 'Так, ми надаємо гарантію повного повернення коштів протягом 14 днів після оплати, якщо сервіс вам не підійшов. Для звернень пишіть на indexfastapp@gmail.com.' }
      ]
    },
    blog: {
      tag: 'Корисні матеріали',
      title: 'Читайте наш блог',
      subtitle: 'Практичні гайди з SEO, індексації та просування в Google',
      introText: 'Практичні гайди з SEO, індексації та просування в Google',
      readMore: 'Всі статті →',
      readArticle: 'Читати статтю →',
      articles: [
        { href: '/blog/yak-pryskoriti-indeksaciyu-saitu-v-google', tag: 'Індексація', readTime: '10 хвилин читання', title: 'Як прискорити індексацію сайту в Google у 2025 році', desc: 'Покроковий гайд: від налаштування sitemap до Google Indexing API. Реальні методи, які працюють.' },
        { href: '/blog/shcho-take-sitemap-xml', tag: 'SEO', readTime: '7 хвилин читання', title: 'Що таке sitemap.xml і чому вашому сайту це потрібно?', desc: 'Повний розбір: структура, типи, помилки та як правильно налаштувати sitemap для Google.' },
      ],
      ctaArticles: {
        title: 'Більше статей про SEO та індексацію',
        desc: 'Практичні гайди, кейси та поради щотижня'
      }
    },
    cta: {
      tag: 'Почніть зараз',
      title: 'Поки ви читаєте—',
      titleEm: 'конкуренти вже в топі',
      subtitle: 'Приєднуйтесь до 247+ сайтів, які вже отримують клієнтів з Google з IndexFast.',
      trust: ['Безкоштовно назавжди', 'Без кредитної картки', 'Офіційний Google API']
    },
    footer: {
      brandDesc: 'Сервіс для автоматичної індексації сторінок сайту в Google через офіційний Google Indexing API.',
      product: {
        howItWorks: 'Як це працює',
        features: 'Переваги',
        pricing: 'Тарифи',
        docs: 'Документація'
      },
      company: {
        about: 'Про нас',
        blog: 'Блог',
        affiliate: 'Партнерська програма',
        contacts: 'Контакти'
      },
      support: {
        faq: 'FAQ',
        telegram: 'Telegram чат',
        email: 'Email підтримка',
        status: 'Статус сервісу'
      },
      copyright: '© 2026 IndexFast. Всі права захищені.',
      privacy: 'Конфіденційність',
      terms: 'Умови'
    },
    about: {
      eyebrow: 'Наша команда',
      title: 'Ми створюємо інструменти<br />для <em>швидкої індексації</em>',
      lead: 'IndexFast — українська команда, що створює інструменти для швидкої індексації в Google. Дізнайтеся про нашу місію, цінності та людей за продуктом.',
      mission: {
        label: 'Місія',
        title: 'Робимо SEO прозорим і ефективним',
        text: 'Ми віримо, що кожен сайт заслуговує бути знайденим в Google. Наша місія — спростити процес індексації і зробити професійні SEO-інструменти доступними для всіх. IndexFast створений, щоб зробити SEO більш прозорим і ефективним. Ми використовуємо тільки офіційно рекомендовані Google методи індексації.'
      },
      values: [
        { icon: '⚡', title: 'Швидкість', desc: 'Ми оптимізуємо кожен процес, щоб давати результат за години, а не тижні.' },
        { icon: '🛡️', title: 'Безпека', desc: 'Тільки офіційні Google API. Ніяких ризиків для вашого сайту.' },
        { icon: '💎', title: 'Прозорість', desc: 'Чіткі ціни, детальні логи, без прихованих платежів.' }
      ],
      team: {
        label: 'Команда',
        title: 'Люди за IndexFast',
        sub: 'Мала команда з великими амбіціями у SEO'
      },
      teamCards: [
        { name: 'Роман Матвій', role: 'Засновник і розробник', bio: 'Фул-стек розробник і ентузіаст SEO. Побудував IndexFast, щоб вирішити реальні проблеми індексації.' },
        { name: 'Андрій К.', role: 'SEO-спеціаліст', bio: 'SEO-спеціаліст з досвідом понад 8 років. Гарантує, що IndexFast дотримується найкращих практик.' },
        { name: 'Марина С.', role: 'Продуктовий дизайнер', bio: 'Створює інтуїтивні інтерфейси, які роблять складні SEO-задачі простими для всіх.' }
      ],
      ukraine: {
        title: 'З гордістю українське',
        text: 'IndexFast народився в Україні. Ми віддані створенню світового класу SEO-інструментів, підтримці нашої спільноти та внеску в технологічну екосистему.',
        badge: '⚡ Зроблено в Україні'
      },
      cta: {
        title: 'Готові прискорити індексацію?',
        subtitle: 'Приєднуйтесь до сотень сайтів, які вже використовують IndexFast',
        btnPrimary: 'Почати безкоштовно →',
        btnSecondary: 'Зв\'язатися з нами'
      }
    },
    contacts: {
      eyebrow: 'Ми на зв\'язку',
      title: 'Контакти та <em>підтримка</em>',
      lead: 'Є запитання? Оберіть зручний спосіб зв\'язку — ми відповімо якомога швидше.',
      cards: [
        { icon: '✈', title: 'Telegram підтримка', desc: 'Найшвидший спосіб отримати відповідь. Спілкуйтеся з командою.', link: 'Написати в Telegram →' },
        { icon: '✉', title: 'Email', desc: 'Для офіційних запитів і пропозицій партнерства.', link: 'indexfastapp@gmail.com →' }
      ],
      seo: {
        title: 'Професійна підтримка для вашого SEO',
        text: 'Наша команда підтримки складається з фахівців, які розуміють Google Indexing API та технічне SEO.',
        items: [
          'Налаштування Google Cloud Console та сервісних акаунтів.',
          'Вирішення помилок \'Сторінка не проіндексована\' в Search Console.',
          'Оптимізація лімітів API для великих проєктів та інтернет-магазинів.',
          'Інтеграція IndexFast у ваші внутрішні робочі процеси.'
        ]
      },
      info: [
        { title: 'Робочі години', desc: 'Пн–Пт 9:00–19:00 (за київським часом). Тариф Agency: пріоритетна підтримка 24/7.' },
        { title: 'Партнерство', desc: 'SEO-студія або розробник? Реферальна програма з виплатами до 20% за підписку.' },
        { title: 'Відповідальність', desc: 'Ми використовуємо тільки офіційно рекомендовані Google методи індексації.' }
      ]
    },
    faqsPage: {
      title: 'Часті запитання',
      subtitle: 'Все, що потрібно знати про індексацію в Google Search Console та IndexFast.',
      meta: {
        questions: '8 запитань',
        updated: '2026'
      },
      cta: {
        title: 'Залишилися запитання?',
        text: 'Наша команда підтримки готова допомогти вам з будь-якими питаннями про IndexFast.',
        btn: 'Написати нам'
      }
    },
    affiliate: {
      badge: 'Партнерська програма',
      title: 'Заробляйте з <em>IndexFast</em>',
      subtitle: 'Рекомендуйте IndexFast своїй аудиторії та заробляйте до 20% рекурентної комісії з кожної підписки.',
      ctaBtn: 'Стати партнером →',
      cards: [
        { icon: '💰', title: 'До 20% комісії', desc: 'Заробляйте рекурентну комісію з кожної рекомендованої підписки. Чим більше клієнтів ви приводите, тим більше заробляєте.' },
        { icon: '📊', title: 'Відстеження в реальному часі', desc: 'Відстежуйте ваші рекомендації, кліки та заробітки в реальному часі через партнерську панель.' },
        { icon: '🎯', title: 'Маркетингові матеріали', desc: 'Отримайте доступ до банерів, логотипів і готового контенту для ефективного просування IndexFast.' }
      ]
    },
    status: {
      title: 'Всі системи працюють',
      subtitle: 'IndexFast працює нормально. Всі сервіси доступні.'
    },
privacyPolicy: {
      title: 'Політика конфіденційності',
      sections: [
        { title: 'Інформація, яку ми збираємо', text: 'Ми збираємо інформацію, яку ви надаєте нам безпосередньо, наприклад, при створенні облікового запису, підписці на наш сервіс або зверненні до нас за підтримкою.' },
        { title: 'Як ми використовуємо вашу інформацію', text: 'Ми використовуємо зібрану інформацію для надання, підтримки та покращення наших сервісів, обробки транзакцій та спілкування з вами.' },
        { title: 'Безпека даних', text: 'Ми впроваджуємо відповідні заходи безпеки для захисту вашої особистої інформації від несанкціонованого доступу, зміни або розголошення.' },
        { title: 'Зв\'язатися з нами', text: 'Якщо у вас виникли запитання щодо цієї Політики конфіденційності, зв\'яжіться з нами за адресою indexfastapp@gmail.com.' }
      ]
    },
    terms: {
      title: 'Умови використання',
      sections: [
        { title: 'Опис сервісу', text: 'IndexFast надає автоматизовані сервіси індексації веб-сайтів за допомогою Google Indexing API та протоколу IndexNow.' },
        { title: 'Підписка та оплата', text: 'Ми пропонуємо різні плани підписки. Оплата обробляється безпечно через наших провайдерів платежів. Підписки автоматично продовжуються, якщо їх не скасовано.' },
        { title: 'Політика повернення', text: 'Ми пропонуємо повне повернення коштів протягом 14 днів після покупки, якщо ви не задоволені нашим сервісом.' },
        { title: 'Зв\'язатися з нами', text: 'Якщо у вас виникли запитання щодо цих умов, зв\'яжіться з нами за адресою indexfastapp@gmail.com.' }
      ]
    },
    ltdPricing: {
      badge: '💰 ціни',
      title: 'Вічний доступ<br /><em>до всіх функцій</em>',
      subtitle: 'Разова оплата, без регулярних платежів. Користуйтесь назавжди!',
      cardBadge: 'Вічний тариф',
      currency: '₴',
      oldPrice: '250',
      newPrice: '120',
      cta: 'Розпочати',
      hurry: 'Терміново! Купіть зараз, поки ціна не зросла',
      whyTitle: 'Чому варто обрати вічний тариф?',
      benefits: [
        { title: 'Безліч доступу', desc: 'Необмежений доступ до всіх функцій преміум-тарифів без місячних обмежень.' },
        { title: 'Безкоштовні оновлення', desc: 'Безкоштовні оновлення та нові функції. Ви автоматично отримуватимете всі майбутні покращення.' },
        { title: 'Преміум-підтримка', desc: 'Преміум-підтримка, яка завжди поруч. Отримуйте пріоритетну відповідь від нашої команди.' },
        { title: 'Разова оплата', desc: 'Разова оплата, без сюрпризів. Заплатіть один раз і користуйтесь назавжди.' },
      ],
      comparisonHeaders: {
        type: 'Тип тарифу',
        monthly: 'Місячний тариф (Базовий)',
        yearly: 'Річний тариф (Базовий)',
      },
      comparisonTitle: 'Порівняння тарифів',
      comparison: [
        { feature: 'Ціна', basic: '₴10/міс', yearly: '₴96/рік', ltd: '₴120 (був ₴250)' },
        { feature: 'Загальна вартість (2 роки)', basic: '₴240', yearly: '₴192', ltd: '₴120' },
        { feature: 'Доступ до функцій', basic: 'Всі', yearly: 'Всі', ltd: 'Всі' },
        { feature: 'Пріоритетна підтримка', basic: '✗', yearly: '✗', ltd: '✓' },
      ],
      features: {
        item1: '3 вебсайти',
        item2: 'Індексація до 200 сторінок/день',
        item3: 'Перевірка нових/змінених сторінок (щоденно)',
        item4: 'Автоматична індексація в Google',
        item5: 'Необмежена кількість URL/вебсайт + пріоритетна підтримка',
      },
      faqTitle: 'Чим можемо допомогти?',
      faqs: [
        {
          q: 'Що відбувається, якщо я користуюсь тільки Google Search Console?',
          a: 'Перейдіть до Google Search Console (search.google.com/search-console), додайте свій сайт, відправте sitemap, і Google колись індексує ваш сайт. Просто. Іноді, залежно від проекту/сайту, питання індексації URL можуть бути головними головними головними головними. І саме тому народився Indexfast.pro — інструмент для індексації URL в Google, який усі головні головними головними головними розв\'язує.',
          note: 'Наш інструмент автоматично перевіряє, які URL вашого сайту проіндексовано, а які ні. Якщо деякі сторінки не проіндексовані, Indexfast.pro швидко вирішить це.',
        },
        {
          q: 'Чи потрібен доступ до мого Search Console?',
          a: 'Так. Ми запитуємо доступ до вашого Search Console, щоб регулярно перевіряти зміни sitemap та автоматично індексувати сторінки. Будьте спокійні, ви можете відклинути доступ у будь-який момент, і всі дані Search Console будуть видалені назавжди.',
          items: ['Перевірка інексації URL', 'Індексація URL'],
        },
        {
          q: 'Як перевірити, чи проіндексовані мої URL?',
          a: 'Щоб визначити, чи URL проіндексовано в Google, використовуйте:',
          items: [
            '<strong>Google Search:</strong> Введіть "site:https://yourwebsite.com/your-url" в пошук Google. Якщо URL з\'явиться в результатах, він проіндексовано.',
            '<strong>Google Search Console:</strong> Відкрийте звіт Index Coverage Report або використовуйте інструмент URL Inspector.',
            '<strong>Google Analytics:</strong> Спостерігайте за органічним трафіком. Якщо трафік приходить від Google, скоріше за все, URL проіндексовано.',
            '<strong>Indexfast.pro:</strong> Наш софт перевіряє щодня індексацію URL вашого сайту.',
          ],
          note: 'Використовуючи ці методи, ви зможете перевірити індексацію будь-якого URL.',
        },
        { q: 'Чи захищені мої дані?', a: 'Захист даних — наша перша пріоритет. Ми захищаємо ваші дані відповідно до вимог GDPR та CCPA.' },
        {
          q: 'Яка політика повернення?',
          a: 'Через витрати на налаштування облікового запису ми не пропонуємо повернення. Однак ви можете скасувати підписку в будь-який час.',
          note: 'Ми цінуємо зворотний зв\'язок — дзвінок, і ми побачимо, що можна зробити.',
        },
        { q: 'Чи можу я змінити тариф пізніше?', a: 'Ви можете апгрейдити/даунгрейдити тариф у будь-який час через ваш білінговий портал.' },
      ],
      purchase: {
        title: 'Як купити вічний тариф?',
        desc: 'Перейдіть до dashboard IndexFast і купіть вічний тариф на сторінці оплати.',
        cta: 'Переглянути тарифи',
        contact: 'Є запитання? <a href="{link}" style="color: var(--green);">Зв\'яжіться з нами</a>',
      },
    }
  }
};

export const getDictionary = (lang) => {
  return dictionaries[lang] || dictionaries.en;
};
