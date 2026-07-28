export const pricingPlans = {
  en: [
    {
      id: 'start',
      name: 'Start',
      price: 0,
      priceCurrency: '$',
      isPopular: false,
      features: [
        { text: '50 URLs per day', included: true },
        { text: '1 connected site', included: true },
        { text: 'Google Indexing API', included: true },
        { text: 'IndexNow support', included: true },
        { text: 'Analytics dashboard', included: false },
        { text: 'Priority support', included: false }
      ],
      ctaText: 'Get started',
      ctaLink: '/app/register',
    },
    {
      id: 'pro',
      name: 'PRO',
      price: '9.99',
      priceCurrency: '$',
      isPopular: true,
      features: [
        { text: '500 URLs per day', included: true },
        { text: 'Up to 5 connected sites', included: true },
        { text: 'Google Indexing API', included: true },
        { text: 'IndexNow support', included: true },
        { text: 'Analytics dashboard', included: true },
        { text: 'Priority support', included: true }
      ],
      ctaText: 'Start Free Trial',
      ctaLink: '/app/register?plan=pro',
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '49',
      priceCurrency: '$',
      isPopular: false,
      features: [
        { text: '5,000 URLs per day', included: true },
        { text: 'Up to 50 connected sites', included: true },
        { text: 'Google Indexing API', included: true },
        { text: 'IndexNow support', included: true },
        { text: 'Analytics dashboard', included: true },
        { text: 'Priority support 24/7', included: true }
      ],
      ctaText: 'Contact Sales',
      ctaLink: '/contacts',
    }
  ],
  uk: [
    {
      id: 'start',
      name: 'Start',
      price: 0,
      priceCurrency: '₴',
      isPopular: false,
      features: [
        { text: '50 URL на день', included: true },
        { text: '1 підключений сайт', included: true },
        { text: 'Google Indexing API', included: true },
        { text: 'Підтримка IndexNow', included: true },
        { text: 'Аналітика', included: false },
        { text: 'Пріоритетна підтримка', included: false }
      ],
      ctaText: 'Розпочати',
      ctaLink: '/app/register',
    },
    {
      id: 'pro',
      name: 'PRO',
      price: '299',
      priceCurrency: '₴',
      isPopular: true,
      features: [
        { text: '500 URL на день', included: true },
        { text: 'До 5 підключених сайтів', included: true },
        { text: 'Google Indexing API', included: true },
        { text: 'Підтримка IndexNow', included: true },
        { text: 'Аналітика', included: true },
        { text: 'Пріоритетна підтримка', included: true }
      ],
      ctaText: 'Почати безкоштовний термін',
      ctaLink: '/app/register?plan=pro',
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '1299',
      priceCurrency: '₴',
      isPopular: false,
      features: [
        { text: '5,000 URL на день', included: true },
        { text: 'До 50 підключених сайтів', included: true },
        { text: 'Google Indexing API', included: true },
        { text: 'Підтримка IndexNow', included: true },
        { text: 'Аналітика', included: true },
        { text: 'Пріоритетна підтримка 24/7', included: true }
      ],
      ctaText: 'Зв\'язатися з продажу',
      ctaLink: '/contacts',
    }
  ],
  get: (lang = 'en') => pricingPlans[lang] || pricingPlans.en
};
