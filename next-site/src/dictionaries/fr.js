export default {
  nav: {
    howItWorks: 'Comment ça marche',
    forWhom: 'Pour qui',
    features: 'Avantages',
    pricing: 'Prix',
    faq: 'FAQ',
    signIn: 'Se connecter',
    getStarted: 'Commencer gratuitement →',
    lang: 'FR ▾'
  },
  hero: {
    badge: '⚡ Google Indexing API & IndexNow',
    title: 'Votre site sur Google et Bing',
    titleEm: 'en 24 heures',
    titleEnd: 'pas en semaines',
    subtitle: 'Arrêtez d\'attendre que Google trouve vos pages. IndexFast les envoie pour indexation instantanément via l\'API officielle.',
    ctaPrimary: '🚀 Commencer gratuitement',
    ctaSecondary: 'Comment ça marche ↓',
    stats: {
      indexed: 'URL indexées',
      customers: 'Clients satisfaits',
      avgTime: 'Temps moyen d\'indexation',
      freePerDay: 'URL gratuites/jour'
    }
  },
  problem: {
    tag: 'Problème',
    title: 'Pourquoi Google ignore<br />votre site ?',
    items: [
      { icon: '⏳', title: 'Googlebot explore rarement', desc: 'Les nouvelles pages peuvent attendre 2 semaines à plusieurs mois pour être indexées — vos concurrents vous dépassent' },
      { icon: '📉', title: 'Le trafic n\'augmente pas', desc: 'Tant que les pages ne sont pas indexées, elles sont invisibles pour les moteurs de recherche et n\'apportent pas de clients' },
      { icon: '🔧', title: 'Search Console est inconfortable', desc: 'Envoyer des URLs manuellement une par une prend des heures et les erreurs API font peur sans connaissances techniques.' }
    ],
    compareTitle: 'Temps jusqu\'à l\'indexation',
    without: '❌ Sans IndexFast',
    with: '✅ Avec IndexFast',
    withoutTime: '2–8 semaines',
    withTime: '24–48 heures',
    speedupLabel: '14× plus rapide',
    speedSub: 'accélération moyenne d\'indexation'
  },
  howItWorks: {
    tag: 'Comment ça marche',
    title: 'Trois étapes vers<br />l\'indexation instantanée',
    subtitle: 'La configuration prend moins de 10 minutes. Aucune connaissance technique requise.',
    steps: [
      { num: '01', icon: '🔑', title: 'Connecter Search Console', desc: 'Téléchargez la clé JSON de votre Google Service Account et ajoutez-la à IndexFast. Une fois pour toujours.' },
      { num: '02', icon: '🗺️', title: 'Spécifier l\'URL du sitemap', desc: 'Entrez l\'adresse de votre sitemap.xml ou simplement le domaine — IndexFast trouvera le sitemap automatiquement.' },
      { num: '03', icon: '⚡', title: 'Obtenir le résultat', desc: 'Toutes les pages sont envoyées pour indexation. Obtenez un rapport détaillé et regardez votre trafic augmenter.' }
    ]
  },
  features: {
    tag: 'Avantages',
    title: 'Tout ce dont vous avez besoin<br />pour les premières positions',
    subtitle: 'Nous avons pris la complexe Google Indexing API et l\'avons transformée en un outil simple pour toute entreprise.',
    items: [
      { icon: '🗺️', title: 'Support Sitemap Index', desc: 'Analyse automatiquement les sitemaps imbriqués de n\'importe quelle profondeur — toutes les URLs seront trouvées et envoyées.' },
      { icon: '📊', title: 'Journal détaillé', desc: 'Chaque opération est enregistrée dans un fichier journal avec l\'heure et le statut. Vous savez toujours ce qui s\'est passé et quand.' },
      { icon: '🛡️', title: 'Gestion des quotas', desc: 'Respecte automatiquement la limite de 200 URL/jour de Google. Pas d\'erreurs de dépassement de quota.' },
      { icon: '⚙️', title: 'Lancement flexible', desc: 'CLI, arguments, mode interactif. Exécutez manuellement, via cron ou pipeline CI/CD.' },
      { icon: '🚀', title: 'API officielle Google', desc: 'Utilise l\'API officielle Google Indexing — pas de schémas gris, mais une méthode légale et fiable.' },
      { icon: '🔄', title: 'Automatisation', desc: 'Configurez un lancement automatique via cron chaque jour — les nouvelles pages s\'indexeront d\'elles-mêmes.' }
    ]
  },
integrations: {
     label: 'Fonctionne avec toute plateforme',
     footer: 'Si votre site a un <strong>sitemap.xml</strong> — IndexFast fonctionne avec lui'
   },
   scroll: 'Défiler',
   period: 'par mois',
  forWhom: {
    tag: 'Pour qui',
    title: 'IndexFast fonctionne<br />pour toute entreprise',
    subtitle: 'Des blogueurs aux agences — si vous avez un site web et voulez du trafic de Google, IndexFast est pour vous.',
    items: [
      { emoji: '🛒', title: 'Boutiques en ligne', desc: 'Des centaines et milliers de pages de produits que Google n\'a pas le temps de scanner. IndexFast garantit que chaque nouveau produit apparaît dans la recherche le plus vite possible.', tags: ['WooCommerce', 'OpenCart', 'Shopify', 'Prom.ua'] },
      { emoji: '✍️', title: 'Blogueurs et médias', desc: 'Vous publiez du contenu tous les jours ? Les nouveaux articles apparaissent dans la recherche le lendemain matin, pas des semaines plus tard. Votre contenu est classé en premier pendant que les concurrents attendent.', tags: ['WordPress', 'Ghost', 'Portails d\'actualités'] },
      { emoji: '🏢', title: 'Sites d\'entreprise', desc: 'Services mis à jour, études de cas ajoutées ou prix changés ? IndexFast signale instantanément les changements à Google. Informations à jour dans les résultats de recherche sans délai.', tags: ['Landings', 'Sites corporate'] },
      { emoji: '🏠', title: 'Immobilier et petites annonces', desc: 'De nouveaux objets apparaissent chaque jour. Les acheteurs cherchent sur Google en ce moment même — chaque minute de retard d\'indexation vous coûte un client.', tags: ['DOM.RIA', 'Agrégateurs', 'Tableaux d\'annonces'] },
      { emoji: '🎯', title: 'Spécialistes SEO et agences', desc: 'Vous gérez plusieurs projets ? Le plan Agency vous permet de gérer jusqu\'à 50 sites clients depuis un seul compte et de générer des rapports white-label.', tags: ['Multisite', 'White-label', 'API'] },
      { emoji: '🚀', title: 'Startups et SaaS', desc: 'Vous lancez un nouveau produit ? L\'indexation rapide de votre landing page et de votre blog signifie les premiers utilisateurs organiques avec zéro dépense publicitaire — déjà la première semaine.', tags: ['Product Hunt', 'Landings', 'Blog'] }
    ]
  },
  testimonials: {
    tag: 'Avis clients',
    title: 'Ils sont déjà en tête de Google',
    items: [
      { badge: '+340% de trafic organique', stars: '★★★★★', text: '"J\'ai lancé une boutique en ligne — 800 produits, aucun indexé pendant des semaines. Après IndexFast, en 2 jours toutes les pages étaient dans Google. Le trafic a augmenté 4 fois le premier mois."', name: 'Andriy Kovalenko', role: 'Propriétaire de boutique en ligne, Kiev', initials: 'AK' },
      { badge: 'Indexation en 18 heures', stars: '★★★★★', text: '"Je blogue sur les voyages — je publie 3-4 articles par semaine. Avant, j\'attendais jusqu\'à 3 semaines pour l\'indexation. Maintenant le nouvel article est en circulation dès le lendemain matin. Cela a tout changé !"', name: 'Maryna Sydorenko', role: 'Blogueuse, 50k abonnés', initials: 'MS' },
      { badge: 'Clients de Google dès la 1ère semaine', stars: '★★★★★', text: '"Nous avons lancé une landing page pour un nouveau produit. Grâce à IndexFast, nous avons reçu nos premiers clients en une semaine. Le SEO organique fonctionne enfin comme il le devrait."', name: 'Dmytro Petrenko', role: 'PDG d\'un SaaS startup', initials: 'DP' },
      { badge: 'Économie de 8 heures/semaine', stars: '★★★★★', text: '"Je gère 15 sites clients. Je passais des heures à soumettre manuellement des URLs via Search Console. Maintenant un script gère tous les clients automatiquement chaque jour."', name: 'Oleg Morozenko', role: 'Spécialiste SEO, freelance', initials: 'OHM' },
      { badge: 'Top 3 en 2 semaines', stars: '★★★★★', text: '"Cabinet d\'avocats, niche très concurrentielle. J\'ai mis à jour les pages de services — IndexFast les a envoyées instantanément. En 2 semaines nous étions dans le top 3 pour les mots clés. Incroyable !"', name: 'Natalia Zakharenko', role: 'Marketeur d\'un cabinet d\'avocats', initials: 'NZ' },
      { badge: '200 → 2400 visiteurs/jour', stars: '★★★★★', text: '"Portail d\'actualités — nous publions 20+ matériaux par jour. IndexFast se lance automatiquement dans cron. Le trafic est passé de 200 à 2 400 visiteurs uniques par mois."', name: 'Vasyl Kravchenko', role: 'Rédacteur en chef médias', initials: 'VK' }
    ]
  },
  pricing: {
    tag: 'Prix',
    title: 'Des prix justes,<br />pas de frais cachés',
    subtitle: 'Commencez gratuitement. Payez seulement quand vous voyez des résultats'
  },
  roi: {
    label: 'Calculateur',
    title: 'Combien économisez-vous<br />avec IndexFast ?',
    subtitle: 'Personnalisez les paramètres pour votre entreprise — et vous verrez un réel bénéfice en temps et en argent.',
    fields: {
      pages: 'Pages sur le site',
      newPages: 'Nouvelles pages par mois',
      rate: 'Votre tarif ($/heure)',
      minsPer: 'Minutes pour indexer manuellement 1 URL'
    },
    results: {
      timeLabel: 'Temps économisé sur l\'indexation',
      costLabel: 'Coût de ce temps',
      speedLabel: 'Accélération de l\'indexation',
      speedValue: 'jusqu\'à 14×',
      speedSub: 'de semaines à 24 heures',
      netBenefitLabel: 'Bénéfice net (économies - coût PRO)',
      profitLabel: 'bénéfice net par mois',
      lossLabel: 'différence (considérez PRO pour des volumes plus importants)',
      actionLabel: 'Obtenir le bénéfice →'
    }
  },
  faq: {
    tag: 'FAQ',
    title: 'Foire aux questions',
    items: [
      { q: 'À quelle vitesse Google indexera-t-il mes pages ?', a: 'Une fois soumises via IndexFast, Google indexe généralement les pages en 24-48 heures. Il est normal qu\'un scan Googlebot puisse prendre de 2 semaines à plusieurs mois.' },
      { q: 'Combien d\'URL puis-je envoyer gratuitement ?', a: 'Google fournit un quota de 200 URL par jour gratuitement via l\'API d\'indexation. Le Plan Free d\'IndexFast gère automatiquement ce quota. Le quota peut être étendu sur les tarifs Pro et Agency.' },
      { q: 'Des connaissances techniques sont-elles requises ?', a: 'Pour une utilisation de base, vous avez seulement besoin de connecter un compte Google Search Console et de spécifier une URL sitemap.xml. Des instructions étape par étape sont incluses. Pour l\'automatisation via cron, vous aurez besoin de connaissances de base en Linux.' },
      { q: 'Est-ce la méthode officielle ? Google ne va pas bannir le site ?', a: 'IndexFast utilise uniquement l\'API officielle Google Indexing. C\'est la méthode recommandée par Google pour l\'accélération de l\'indexation. Aucun risque pour votre site.' },
      { q: 'Et les autres moteurs de recherche (Bing, Naver) ?', a: 'Oui, IndexFast supporte également pleinement le protocole IndexNow. Cela signifie que vos liens sont automatiquement envoyés non seulement à Google, mais aussi à Bing, Naver, Seznam.cz et Yep simultanément.' },
      { q: 'Et si mon site est sur WordPress / Webflow / une autre plateforme ?', a: 'IndexFast fonctionne avec tout site qui a un sitemap.xml — WordPress, Webflow, Wix, personnalisé. Si votre site a un sitemap — IndexFast fonctionne avec lui.' },
      { q: 'Comment configurer le démarrage automatique chaque jour ?', a: 'Les tarifs Pro et Agency disposent d\'un planificateur intégré. Sur le plan gratuit, vous pouvez configurer une tâche cron sur le serveur — des instructions détaillées dans la documentation.' },
      { q: 'Y a-t-il un remboursement ?', a: 'Oui, nous offrons une garantie de remboursement complet dans les 14 jours suivant le paiement si le service ne vous convenait pas. Pour toute demande, écrivez à indexfastapp@gmail.com.' }
    ]
  },
  blog: {
    tag: 'Matériaux utiles',
    title: 'Lisez notre blog',
    subtitle: 'Guides pratiques sur le SEO, l\'indexation et la promotion sur Google',
    introText: 'Guides pratiques sur le SEO, l\'indexation et la promotion sur Google',
    readMore: 'Tous les articles →',
    readArticle: 'Lire l\'article →',
    articles: [
      { href: '/blog/yak-pryskoriti-indeksaciyu-saitu-v-google', tag: 'Indexation', readTime: '10 minutes de lecture', title: 'Comment accélérer l\'indexation de votre site sur Google en 2025', desc: 'Guide étape par étape : de la configuration de la sitemap à l\'API Google Indexing. Méthodes réelles qui fonctionnent.' },
      { href: '/blog/shcho-take-sitemap-xml', tag: 'SEO', readTime: '7 minutes de lecture', title: 'Qu\'est-ce que sitemap.xml et pourquoi votre site en avez-vous besoin?', desc: 'Analyse complète : structure, types, erreurs et comment configurer correctement la sitemap pour Google.' },
    ],
    ctaArticles: {
      title: 'Plus d\'articles sur le SEO et l\'indexation',
      desc: 'Guides pratiques, cas et conseils chaque semaine'
    }
  },
  cta: {
    tag: 'Commencez maintenant',
    title: 'Pendant que vous lisez—',
    titleEm: 'les concurrents sont déjà dans le top',
    subtitle: 'Rejoignez les 247+ sites qui reçoivent déjà des clients de Google avec IndexFast.',
    trust: ['Gratuit pour toujours', 'Pas de carte de crédit', 'API officielle Google']
  },
  footer: {
    brandDesc: 'Service pour l\'indexation automatique des pages de sites web sur Google via l\'API officielle Google Indexing.',
    product: {
      howItWorks: 'Comment ça marche',
      features: 'Avantages',
      pricing: 'Tarifs',
      docs: 'Documentation'
    },
    company: {
      about: 'À propos',
      blog: 'Blog',
      affiliate: 'Programme d\'affiliation',
      contacts: 'Contacts'
    },
    support: {
      faq: 'FAQ',
      telegram: 'Chat Telegram',
      email: 'Support email',
      status: 'Statut du service'
    },
    copyright: '© 2026 IndexFast. Tous droits réservés.',
    privacy: 'Confidentialité',
    terms: 'Conditions'
  },
  about: {
    eyebrow: 'Notre équipe',
    title: 'Nous créons des outils<br />pour <em>l\'indexation rapide</em>',
    lead: 'IndexFast est une équipe ukrainienne qui construit des outils pour l\'indexation rapide sur Google. Découvrez notre mission, nos valeurs et les personnes derrière le produit.',
    mission: {
      label: 'Mission',
      title: 'SEO transparent et effectif',
      text: 'Nous croyons que chaque site web mérite d\'être trouvé sur Google. Notre mission est de simplifier le processus d\'indexation et de rendre les outils SEO professionnels accessibles à tous. IndexFast a été créé pour rendre le SEO plus transparent et effectif. Nous utilisons uniquement des méthodes d\'indexation recommandées officiellement par Google.'
    },
    values: [
      { icon: '⚡', title: 'Vitesse', desc: 'Nous optimisons chaque processus pour fournir des résultats en heures, pas en semaines.' },
      { icon: '🛡️', title: 'Sécurité', desc: 'Seules les APIs officielles de Google. Aucun risque pour votre site.' },
      { icon: '💎', title: 'Transparence', desc: 'Tarifs clairs, journaux détaillés, pas de frais cachés.' }
    ],
    team: {
      label: 'Équipe',
      title: 'Les personnes derrière IndexFast',
      sub: 'Une petite équipe avec de grandes ambitions en SEO'
    },
    teamCards: [
      { name: 'Roman Matviy', role: 'Fondateur & Développeur', bio: 'Développeur full-stack et passionné de SEO. A construit IndexFast pour résoudre de vrais problèmes d\'indexation.' },
      { name: 'Andriy K.', role: 'Spécialiste SEO', bio: 'Spécialiste SEO avec plus de 8 ans d\'expérience. S\'assure qu\'IndexFast respecte les meilleures pratiques.' },
      { name: 'Maryna S.', role: 'Designer Produit', bio: 'Crée des interfaces intuitives qui rendent les tâches SEO complexes simples pour tous.' }
    ],
    ukraine: {
      title: 'Fièrement ukrainien',
      text: 'IndexFast est né en Ukraine. Nous nous engageons à créer des outils SEO de classe mondiale tout en soutenant notre communauté et en contribuant à l\'écosystème technologique.',
      badge: '⚡ Fabriqué en Ukraine'
    },
    cta: {
      title: 'Prêt à accélérer votre indexation ?',
      subtitle: 'Rejoignez des centaines de sites qui utilisent déjà IndexFast',
      btnPrimary: 'Commencer gratuitement →',
      btnSecondary: 'Contactez-nous'
    }
  },
  contacts: {
    eyebrow: 'Nous sommes en contact',
    title: 'Contacts et <em>support</em>',
    lead: 'Vous avez des questions ? Choisissez un moyen pratique de nous contacter — nous vous répondrons dès que possible.',
    cards: [
      { icon: '✈', title: 'Support Telegram', desc: 'Le moyen le plus rapide d\'obtenir une réponse. Discutez avec l\'équipe.', link: 'Écrire sur Telegram →' },
      { icon: '✉', title: 'Email', desc: 'Pour les demandes officielles et les propositions de partenariat.', link: 'indexfastapp@gmail.com →' }
    ],
    seo: {
      title: 'Support professionnel pour votre SEO',
      text: 'Notre équipe de support est composée de spécialistes qui comprennent l\'API Google Indexing et le SEO technique.',
      items: [
        'Configuration de Google Cloud Console et des comptes de service.',
        'Résolution des erreurs \'Page non indexée\' dans Search Console.',
        'Optimisation des limites API pour les grands projets et les boutiques en ligne.',
        'Intégration d\'IndexFast dans vos flux de travail internes.'
      ]
    },
    info: [
      { title: 'Heures de travail', desc: 'Lun–Ven 9:00–19:00 (heure de Kiev). Plan Agency : support prioritaire 24/7.' },
      { title: 'Partenariat', desc: 'Studio SEO ou développeur ? Programme de parrainage avec des paiements jusqu\'à 20% par abonnement.' },
      { title: 'Responsabilité', desc: 'Nous utilisons uniquement des méthodes d\'indexation recommandées officiellement par Google.' }
    ]
  },
  faqsPage: {
    title: 'Foire aux questions',
    subtitle: 'Tout ce que vous devez savoir sur l\'indexation dans Google Search Console et IndexFast.',
    meta: {
      questions: '8 questions',
      updated: '2026'
    },
    cta: {
      title: 'Des questions ?',
      text: 'Notre équipe de support est prête à vous aider avec toute question sur IndexFast.',
      btn: 'Écrivez-nous'
    }
  },
  affiliate: {
    badge: 'Programme d\'affiliation',
    title: 'Gagnez avec <em>IndexFast</em>',
    subtitle: 'Recommandez IndexFast à votre audience et gagnez jusqu\'à 20% de commission récurrente par abonnement.',
    ctaBtn: 'Devenir partenaire →',
    cards: [
      { icon: '💰', title: 'Jusqu\'à 20% de commission', desc: 'Gagnez une commission récurrente pour chaque abonnement recommandé. Plus vous apportez de clients, plus vous gagnez.' },
      { icon: '📊', title: 'Suivi en temps réel', desc: 'Suivez vos références, clics et gains en temps réel via notre tableau de bord partenaire.' },
      { icon: '🎯', title: 'Matériels marketing', desc: 'Accédez à des bannières, logos et contenus prêts à promouvoir IndexFast efficacement.' }
    ]
  },
  status: {
    title: 'Tous les systèmes opérationnels',
    subtitle: 'IndexFast fonctionne normalement. Tous les services sont disponibles.'
  },
  privacyPolicy: {
    title: 'Politique de Confidentialité',
    sections: [
      { title: 'Informations que nous collectons', text: 'Nous collectons les informations que vous nous fournissez directement, par exemple lors de la création d\'un compte, de l\'abonnement à notre service ou du contact de notre support.' },
      { title: 'Comment nous utilisons vos informations', text: 'Nous utilisons les informations collectées pour fournir, maintenir et améliorer nos services, traiter les transactions et communiquer avec vous.' },
      { title: 'Sécurité des données', text: 'Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre tout accès, modification ou divulgation non autorisé.' },
      { title: 'Contactez-nous', text: 'Si vous avez des questions sur cette Politique de Confidentialité, veuillez nous contacter à indexfastapp@gmail.com.' }
    ]
  },
  terms: {
    title: 'Conditions d\'Utilisation',
    sections: [
      { title: 'Description du service', text: 'IndexFast fournit des services d\'indexation automatisés de sites web utilisant l\'API Google Indexing et le protocole IndexNow.' },
      { title: 'Abonnement et facturation', text: 'Nous proposons différents plans d\'abonnement. Le paiement est traité en toute sécurité via nos fournisseurs de paiement. Les abonnements se renouvellent automatiquement sauf annulation.' },
      { title: 'Politique de remboursement', text: 'Nous offrons un remboursement complet dans les 14 jours suivant l\'achat si vous n\'êtes pas satisfait de notre service.' },
      { title: 'Contactez-nous', text: 'Si vous avez des questions sur ces conditions, veuillez nous contacter à indexfastapp@gmail.com.' }
    ]
  },
  ltdPricing: {
    badge: '💰 Prix',
    title: 'Accès à vie<br /><em>à toutes les fonctions</em>',
    subtitle: 'Paiement unique, sans frais récurrents. Utilisez pour toujours!',
    cardBadge: 'Forfait à vie',
    currency: '$',
    oldPrice: '250',
    newPrice: '120',
    cta: 'Commencer',
    hurry: 'Dépêchez-vous!!! Achetez maintenant avant que le prix ne augmente',
    whyTitle: 'Pourquoi choisir le forfait à vie?',
    benefits: [
      { title: 'Unlimited access', desc: 'Unlimited access to all features available in the premium tiers without any monthly caps holding you back.' },
      { title: 'Free updates', desc: 'Free updates and new features. You will automatically receive all future improvements to the platform.' },
      { title: 'Premium support', desc: 'Premium support, always at your side. Get priority response from our dedicated support team.' },
      { title: 'One-time payment', desc: 'One-time payment, no surprises. Pay once and use the tool forever, completely eliminating subscription fatigue.' },
    ],
    comparisonHeaders: {
      type: 'Type de forfait',
      monthly: 'Forfait Mensuel (Basic)',
      yearly: 'Forfait Annuel (Basic)',
    },
    comparisonTitle: 'Comparaison des forfaits',
    comparison: [
      { feature: 'Prix', basic: '$10/mois', yearly: '$96/an', ltd: '$120 (était $250)' },
      { feature: 'Coût total (2 ans)', basic: '$240', yearly: '$192', ltd: '$120' },
      { feature: 'Accès aux fonctions', basic: 'Toutes', yearly: 'Toutes', ltd: 'Toutes' },
      { feature: 'Support prioritaire', basic: '✗', yearly: '✗', ltd: '✓' },
    ],
    features: {
      item1: '3 sites web',
      item2: 'Indexer jusqu\'à 200 pages/jour',
      item3: 'Vérification des pages nouvelles/modifiées (quotidienne)',
      item4: 'Indexation automatique Google',
      item5: 'URLs illimitées/site web + support prioritaire',
    },
    faqTitle: 'Comment pouvons-nous vous aider?',
    faqs: [
      { q: 'Que se passe-t-il si j\'utilise seulement Google Search Console?', a: 'Allez dans Google Search Console (search.google.com/search-console), ajoutez votre site, soumettez un sitemap, et Google indexera éventuellement votre site.' },
      { q: 'Avez-vous besoin de l\'accès à mon Search Console?', a: 'Oui. Nous demandons l\'accès à votre Search Console pour vérifier régulièrement les modifications et indexer automatiquement les pages.' },
      { q: 'Comment vérifier si mes URLs sont indexées?', a: 'Utilisez les méthodes suivantes pour déterminer si une URL est indexée dans Google.' },
      { q: 'Mes données sont-elles sécurisées?', a: 'La protection des données est notre première priorité. Nous protégeons vos données conformément aux normes GDPR et CCPA.' },
      { q: 'Quelle est la politique de remboursement?', a: 'En raison des coûts de configuration, nous n\'offrons pas de remboursement. Vous pouvez annuler à tout moment.' },
      { q: 'Puis-je changer de forfait plus tard?', a: 'Vous pouvez mettre à jour/réduire votre forfait à tout moment depuis votre portail de facturation.' },
    ],
    purchase: {
      title: 'Comment acheter le forfait à vie?',
      desc: 'Allez dans le dashboard IndexFast et achetez le forfait à vie depuis la page de facturation.',
      cta: 'Voir les forfaits',
      contact: 'Des questions? <a href="{link}" style="color: var(--green);">Contactez-nous</a>',
    }
  }
};
