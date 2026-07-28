export default {
  nav: {
    howItWorks: 'So funktioniert es',
    forWhom: 'Für wen',
    features: 'Vorteile',
    pricing: 'Preise',
    faq: 'FAQ',
    signIn: 'Anmelden',
    getStarted: 'Kostenlos starten →',
    lang: 'DE ▾'
  },
  hero: {
    badge: '⚡ Google Indexing API & IndexNow',
    title: 'Ihre Website in Google und Bing',
    titleEm: 'in 24 Stunden',
    titleEnd: 'nicht in Wochen',
    subtitle: 'Hören Sie auf, darauf zu warten, dass Google Ihre Seiten findet. IndexFast sendet sie zur sofortigen Indizierung über die offizielle API.',
    ctaPrimary: '🚀 Kostenlos starten',
    ctaSecondary: 'So funktioniert es ↓',
    stats: {
      indexed: 'URL indexiert',
      customers: 'Zufriedene Kunden',
      avgTime: 'Durchschnittliche Indexierungszeit',
      freePerDay: 'URL kostenlos/Tag'
    }
  },
  problem: {
    tag: 'Problem',
    title: 'Warum ignoriert Google<br />Ihre Website?',
    items: [
      { icon: '⏳', title: 'Googlebot crawelt selten', desc: 'Neue Seiten können 2 Wochen bis mehrere Monate auf die Indizierung warten — Ihre Konkurrenten überholen Sie' },
      { icon: '📉', title: 'Der Traffic wächst nicht', desc: 'Solange die Seiten nicht indexiert sind, sind sie für Suchmaschinen unsichtbar und bringen keine Kunden' },
      { icon: '🔧', title: 'Search Console ist umständlich', desc: 'URLs manuell einzeln zu senden dauert Stunden und API-Fehter erschrecken ohne technisches Wissen.' }
    ],
    compareTitle: 'Zeit bis zur Indizierung',
    without: '❌ Ohne IndexFast',
    with: '✅ Mit IndexFast',
    withoutTime: '2–8 Wochen',
    withTime: '24–48 Stunden',
    speedupLabel: '14× schneller',
    speedupSub: 'durchschnittliche Beschleunigung der Indizierung'
  },
  howItWorks: {
    tag: 'So funktioniert es',
    title: 'Drei Schritte zur<br />sofortigen Indizierung',
    subtitle: 'Die Einrichtung dauert weniger als 10 Minuten. Keine technischen Kenntnisse erforderlich.',
    steps: [
      { num: '01', icon: '🔑', title: 'Search Console verbinden', desc: 'Laden Sie den JSON-Schlüssel Ihres Google Service Account herunter und fügen Sie ihn zu IndexFast hinzu. Einmal und für immer.' },
      { num: '02', icon: '🗺️', title: 'Sitemap-URL angeben', desc: 'Geben Sie die Adresse Ihrer sitemap.xml ein oder einfach die Domain — IndexFast findet die Sitemap automatisch.' },
      { num: '03', icon: '⚡', title: 'Ergebnis erhalten', desc: 'Alle Seiten werden zur Indizierung gesendet. Erhalten Sie einen detaillierten Bericht und beobachten Sie Ihr Traffic-Wachstum.' }
    ]
  },
  features: {
    tag: 'Vorteile',
    title: 'Alles was Sie brauchen<br />für Top-Positionen',
    subtitle: 'Wir haben die komplexe Google Indexing API genommen und in ein einfaches Werkzeug für jedes Unternehmen verwandelt.',
    items: [
      { icon: '🗺️', title: 'Sitemap Index Unterstützung', desc: 'Analysiert automatisch verschachtelte Sitemaps beliebiger Tiefe — alle URLs werden gefunden und gesendet.' },
      { icon: '📊', title: 'Detailliertes Protokoll', desc: 'Jeder Vorgang wird in einer Protokolldatei mit Zeit und Status aufgezeichnet. Sie wissen immer, was wann passiert ist.' },
      { icon: '🛡️', title: 'Kontingentverwaltung', desc: 'Hält sich automatisch an das Google-Limit von 200 URLs/Tag. Keine Kontingentüberschreitungsfehler.' },
      { icon: '⚙️', title: 'Flexibler Start', desc: 'CLI, Argumente, interaktiver Modus. Manuell, per Cron oder CI/CD-Pipeline ausführen.' },
      { icon: '🚀', title: 'Offizielle Google API', desc: 'Verwendet die offizielle Google Indexing API — keine Grauzonen, sondern eine legale und zuverlässige Methode.' },
      { icon: '🔄', title: 'Automatisierung', desc: 'Richten Sie einen automatischen Start über Cron jeden Tag ein — neue Seiten indexieren sich selbst.' }
    ]
  },
integrations: {
     label: 'Funktioniert mit jeder Plattform',
     footer: 'Wenn Ihre Website eine <strong>sitemap.xml</strong> hat — IndexFast funktioniert damit'
   },
   scroll: 'Scrollen',
   period: 'pro Monat',
   pricingPlans: {
     start: {
       name: 'Start',
       features: [
         { text: '50 URLs pro Tag' },
         { text: '1 verbundene Website' },
         { text: 'Google Indexing API' },
         { text: 'IndexNow Unterstützung' },
         { text: 'Analytics Dashboard', disabled: true },
         { text: 'Prioritätsunterstützung', disabled: true }
       ],
       ctaText: 'Loslegen'
     },
     pro: {
       name: 'PRO',
       features: [
         { text: '500 URLs pro Tag' },
         { text: 'Bis zu 5 verbundene Websites' },
         { text: 'Google Indexing API' },
         { text: 'IndexNow Unterstützung' },
         { text: 'Analytics Dashboard' },
         { text: 'Prioritätsunterstützung' }
       ],
       ctaText: 'Kostenlose Testphase starten'
     },
     agency: {
       name: 'Agency',
       features: [
         { text: '5.000 URLs pro Tag' },
         { text: 'Bis zu 50 verbundene Websites' },
         { text: 'Google Indexing API' },
         { text: 'IndexNow Unterstützung' },
         { text: 'Analytics Dashboard' },
         { text: 'Prioritätsunterstützung 24/7' }
       ],
       ctaText: 'Verkaufscontact'
     }
   },
  forWhom: {
    tag: 'Für wen',
    title: 'IndexFast funktioniert<br />für jedes Unternehmen',
    subtitle: 'Von Bloggern bis Agenturen — wenn Sie eine Website haben und Traffic von Google wollen, IndexFast ist für Sie.',
    items: [
      { emoji: '🛒', title: 'Online-Shops', desc: 'Hunderte und Tausende von Produktseiten, die Google nicht schnell genug scannen kann. IndexFast garantiert, dass jedes neue Produkt so schnell wie möglich in die Suche gelangt.', tags: ['WooCommerce', 'OpenCart', 'Shopify', 'Prom.ua'] },
      { emoji: '✍️', title: 'Blogger und Medien', desc: 'Täglich Content veröffentlichen? Neue Artikel erscheinen schon am nächsten Morgen in der Suche, nicht erst Wochen später. Ihr Content rankt an erster Stelle, während Konkurrenten warten.', tags: ['WordPress', 'Ghost', 'Nachrichtenportale'] },
      { emoji: '🏢', title: 'Unternehmens-Websites', desc: 'Dienste aktualisiert, Case Studies hinzugefügt oder Preise geändert? IndexFast signalisiert Google sofort über Änderungen. Aktuelle Informationen in Suchergebnissen ohne Verzögerung.', tags: ['Landingpages', 'Unternehmensseiten'] },
      { emoji: '🏠', title: 'Immobilien und Kleinanzeigen', desc: 'Neue Objekte erscheinen täglich. Käufer suchen gerade jetzt auf Google — jede Minute Indexierungsverzögerung kostet Sie einen Kunden.', tags: ['DOM.RIA', 'Aggregatoren', 'Brettanzeigen'] },
      { emoji: '🎯', title: 'SEO-Spezialisten und Agenturen', desc: 'Mehrere Projekte verwalten? Der Agency-Plan ermöglicht die Verwaltung von bis zu 50 Client-Websites aus einem Konto und die Erstellung von White-Label-Berichten.', tags: ['Multisite', 'White-Label', 'API'] },
      { emoji: '🚀', title: 'Startups und SaaS', desc: 'Neues Produkt starten? Schnelle Indizierung Ihrer Landingpage und Ihres Blogs bedeutet erste organische Nutzer mit Null-Werbeausgaben — bereits in der ersten Woche.', tags: ['Product Hunt', 'Landingpages', 'Blog'] }
    ]
  },
  testimonials: {
    tag: 'Kundenbewertungen',
    title: 'Sie sind bereits an der Spitze von Google',
    items: [
      { badge: '+340% organischer Traffic', stars: '★★★★★', text: '"Einen Online-Shop gestartet — 800 Produkte, von denen keines wochenlang indexiert wurde. Nach IndexFast waren nach 2 Tagen alle Seiten in Google. Der Traffic hat sich im ersten Monat vervierfacht."', name: 'Andriy Kovalenko', role: 'Inhaber eines Online-Shops, Kiew', initials: 'AK' },
      { badge: 'Indizierung in 18 Stunden', stars: '★★★★★', text: '"Ich blogge über Reisen — ich veröffentliche 3-4 Artikel pro Woche. Früher wartete ich bis zu 3 Wochen auf die Indizierung. Jetzt ist der neue Artikel bereits am nächsten Morgen im Umlauf. Es hat alles verändert!"', name: 'Maryna Sydorenko', role: 'Bloggerin, 50k Follower', initials: 'MS' },
      { badge: 'Kunden von Google ab der 1. Woche', stars: '★★★★★', text: '"Wir haben eine Landingpage für ein neues Produkt gestartet. Dank IndexFast haben wir innerhalb einer Woche erste Kunden erhalten. Organisches SEO funktioniert endlich so, wie es sollte."', name: 'Dmytro Petrenko', role: 'CEO eines SaaS-Startups', initials: 'DP' },
      { badge: '8 Stunden/Woche gespart', stars: '★★★★★', text: '"Ich betreue 15 Client-Websites. Früher verbrachte ich Stunden mit der manuellen URL-Einreichung über die Search Console. Jetzt verarbeitet ein Skript alle Kunden automatisch jeden Tag."', name: 'Oleg Morozenko', role: 'SEO-Spezialist, Freelancer', initials: 'OHM' },
      { badge: 'Top 3 in 2 Wochen', stars: '★★★★★', text: '"Anwaltskanzlei, sehr wettbewerbsintensive Nische. Ich habe die Dienstleistungsseiten aktualisiert — IndexFast hat sie sofort gesendet. Nach 2 Wochen waren wir in den Top 3 für Schlüsselwörter. Unglaublich!"', name: 'Natalia Zakharenko', role: 'Marketerin einer Anwaltskanzlei', initials: 'NZ' },
      { badge: '200 → 2400 Besucher/Tag', stars: '★★★★★', text: '"Nachrichtenportal — wir veröffentlichen 20+ Materialien pro Tag. IndexFast startet automatisch im Cron. Der Traffic wuchs von 200 auf 2.400 Unique Visitors pro Monat."', name: 'Vasyl Kravchenko', role: 'Chefredakteur Medien', initials: 'VK' }
    ]
  },
  pricing: {
    tag: 'Preise',
    title: 'Faire Preise,<br />keine versteckten Gebühren',
    subtitle: 'Kostenlos anfangen. Zahlen Sie nur, wenn Sie Ergebnisse sehen'
  },
  roi: {
    label: 'Rechner',
    title: 'Wie viel sparen Sie<br />mit IndexFast?',
    subtitle: 'Passen Sie die Einstellungen für Ihr Unternehmen an — und Sie werden einen echten Nutzen in Zeit und Geld sehen.',
    fields: {
      pages: 'Seiten auf der Website',
      newPages: 'Neue Seiten pro Monat',
      rate: 'Ihr Tarif ($/Stunde)',
      minsPer: 'Minuten für die manuelle Indizierung von 1 URL'
    },
    results: {
      timeLabel: 'Bei der Indizierung eingesparte Zeit',
      costLabel: 'Kosten dieser Zeit',
      speedLabel: 'Beschleunigung der Indizierung',
      speedValue: 'bis zu 14×',
      speedSub: 'von Wochen auf 24 Stunden',
      netBenefitLabel: 'Nettonutzen (Einsparungen - PRO-Kosten)',
      profitLabel: 'Nettogewinn pro Monat',
      lossLabel: 'Differenz (PRO für größere Volumen erwägen)',
      actionLabel: 'Nutzen erhalten →'
    }
  },
  faq: {
    tag: 'FAQ',
    title: 'Häufig gestellte Fragen',
    items: [
      { q: 'Wie schnell indexiert Google meine Seiten?', a: 'Nach der Einreichung über IndexFast indexiert Google Seiten normalerweise innerhalb von 24-48 Stunden. Es ist normal, dass ein Googlebot-Scan 2 Wochen bis mehrere Monate dauern kann.' },
      { q: 'Wie viele URLs kann ich kostenlos senden?', a: 'Google bietet ein Kontingent von 200 URLs pro Tag kostenlos über die Indexing API. IndexFast Free Plan verwaltet dieses Kontingent automatisch. Das Kontingent kann in den Pro- und Agency-Tarifen erweitert werden.' },
      { q: 'Sind technische Kenntnisse erforderlich?', a: 'Für die Grundnutzung müssen Sie nur ein Google Search Console-Konto verbinden und eine sitemap.xml-URL angeben. Schritt-für-Schritt-Anleitungen sind enthalten. Für die Automatisierung über Cron benötigen Sie Grundkenntnisse in Linux.' },
      { q: 'Ist dies die offizielle Methode? Wird die Website nicht von Google bestraft?', a: 'IndexFast verwendet nur die offizielle Google Indexing API. Dies ist die von Google empfohlene Methode zur Beschleunigung der Indizierung. Keine Risiken für Ihre Website.' },
      { q: 'Wie sieht es mit anderen Suchmaschinen aus (Bing, Naver)?', a: 'Ja, IndexFast unterstützt auch vollständig das IndexNow-Protokoll. Das bedeutet, dass Ihre Links automatisch nicht nur an Google, sondern auch an Bing, Naver, Seznam.cz und Yep gleichzeitig gesendet werden.' },
      { q: 'Was, wenn meine Website auf WordPress / Webflow / einer anderen Plattform läuft?', a: 'IndexFast funktioniert mit jeder Website, die eine sitemap.xml hat — WordPress, Webflow, Wix, benutzerdefiniert. Wenn Ihre Website eine Sitemap hat — IndexFast funktioniert damit.' },
      { q: 'Wie richte ich den automatischen Start jeden Tag ein?', a: 'Die Pro- und Agency-Tarife verfügen über einen eingebauten Planer. Im kostenlosen Plan können Sie einen Cron-Job auf dem Server einrichten — detaillierte Anleitungen finden Sie in der Dokumentation.' },
      { q: 'Gibt es eine Rückerstattung?', a: 'Ja, wir bieten eine volle Rückerstattungsgarantie innerhalb von 14 Tagen nach der Zahlung, wenn der Dienst nicht für Sie geeignet war. Für Anfragen schreiben Sie an indexfastapp@gmail.com.' }
    ]
  },
  blog: {
    tag: 'Nützliche Materialien',
    title: 'Lesen Sie unseren Blog',
    subtitle: 'Praktische Anleitungen zu SEO, Indizierung und Promotion in Google',
    introText: 'Praktische Anleitungen zu SEO, Indizierung und Promotion in Google',
    readMore: 'Alle Artikel →',
    readArticle: 'Artikel lesen →',
    articles: [
      { href: '/blog/yak-pryskoriti-indeksaciyu-saitu-v-google', tag: 'Indizierung', readTime: '10 Minuten Lesezeit', title: 'Wie man die Indexierung der Website in Google 2025 beschleunigt', desc: 'Schritt-für-Schritt-Anleitung: Von der Sitemap-Einrichtung zur Google Indexing API. Reelle Methoden, die funktionieren.' },
      { href: '/blog/shcho-take-sitemap-xml', tag: 'SEO', readTime: '7 Minuten Lesezeit', title: 'Was ist sitemap.xml und warum benötigen Sie es?', desc: 'Vollständige Analyse: Struktur, Typen, Fehler und wie man eine Sitemap für Google korrekt einrichtet.' },
    ],
    ctaArticles: {
      title: 'Mehr Artikel über SEO und Indexierung',
      desc: 'Praktische Anleitungen, Fälle und Tipps wöchentlich'
    }
  },
  cta: {
    tag: 'Jetzt starten',
    title: 'Während Sie lesen—',
    titleEm: 'Konkurrenten bereits in den Top-Ergebnissen',
    subtitle: 'Schließen Sie sich 247+ Websites an, die bereits Kunden von Google mit IndexFast erhalten.',
    trust: ['Für immer kostenlos', 'Keine Kreditkarte', 'Offizielle Google API']
  },
  footer: {
    brandDesc: 'Service für die automatische Indizierung von Website-Seiten in Google über die offizielle Google Indexing API.',
    product: {
      howItWorks: 'So funktioniert es',
      features: 'Vorteile',
      pricing: 'Tarife',
      docs: 'Dokumentation'
    },
    company: {
      about: 'Über uns',
      blog: 'Blog',
      affiliate: 'Partnerprogramm',
      contacts: 'Kontakte'
    },
    support: {
      faq: 'FAQ',
      telegram: 'Telegram Chat',
      email: 'E-Mail Support',
      status: 'Service-Status'
    },
    copyright: '© 2026 IndexFast. Alle Rechte vorbehalten.',
    privacy: 'Datenschutz',
    terms: 'Bedingungen'
  },
  about: {
    eyebrow: 'Unser Team',
    title: 'Wir bauen Werkzeuge<br />für <em>schnelle Indizierung</em>',
    lead: 'IndexFast ist ein ukrainisches Team, das Werkzeuge für die schnelle Google-Indizierung entwickelt. Erfahren Sie mehr über unsere Mission, Werte und die Menschen hinter dem Produkt.',
    mission: {
      label: 'Mission',
      title: 'SEO transparent und effektiv machen',
      text: 'Wir glauben, dass jede Website es verdient, auf Google gefunden zu werden. Unsere Mission ist es, den Indizierungsprozess zu vereinfachen und professionelle SEO-Werkzeuge für alle zugänglich zu machen. IndexFast wurde geschaffen, um SEO transparenter und effektiver zu machen. Wir verwenden nur offiziell von Google empfohlene Indizierungsmethoden.'
    },
    values: [
      { icon: '⚡', title: 'Geschwindigkeit', desc: 'Wir optimieren jeden Prozess, um Ergebnisse in Stunden und nicht Wochen zu liefern.' },
      { icon: '🛡️', title: 'Sicherheit', desc: 'Nur offizielle Google APIs. Keine Risiken für Ihre Website.' },
      { icon: '💎', title: 'Transparenz', desc: 'Klare Preise, detaillierte Protokolle, keine versteckten Gebühren.' }
    ],
    team: {
      label: 'Team',
      title: 'Die Menschen hinter IndexFast',
      sub: 'Ein kleines Team mit großen Ambitionen im SEO'
    },
    teamCards: [
      { name: 'Roman Matviy', role: 'Gründer & Entwickler', bio: 'Full-Stack-Entwickler und SEO-Enthusiast. Erbaute IndexFast, um echte Indizierungsprobleme zu lösen.' },
      { name: 'Andriy K.', role: 'SEO-Spezialist', bio: 'SEO-Spezialist mit über 8 Jahren Erfahrung. Stellt sicher, dass IndexFast bewährte Verfahren einhält.' },
      { name: 'Maryna S.', role: 'Produktdesignerin', bio: 'Erstellt intuitive Benutzeroberflächen, die komplexe SEO-Aufgaben für alle einfach machen.' }
    ],
    ukraine: {
      title: 'Stolz ukrainisch',
      text: 'IndexFast wurde in der Ukraine geboren. Wir setzen uns für die Schaffung von SEO-Werkzeugen der Weltklasse ein, unterstützen unsere Gemeinschaft und tragen zur Technologieökosystem bei.',
      badge: '⚡ Hergestellt in der Ukraine'
    },
    cta: {
      title: 'Bereit, Ihre Indizierung zu beschleunigen?',
      subtitle: 'Schließen Sie sich Hunderten von Websites an, die IndexFast bereits nutzen',
      btnPrimary: 'Kostenlos starten →',
      btnSecondary: 'Kontaktieren Sie uns'
    }
  },
  contacts: {
    eyebrow: 'Wir sind in Kontakt',
    title: 'Kontakte und <em>Support</em>',
    lead: 'Haben Sie Fragen? Wählen Sie eine bequeme Kontaktmöglichkeit — wir werden so schnell wie möglich antworten.',
    cards: [
      { icon: '✈', title: 'Telegram Support', desc: 'Schnellste Möglichkeit, eine Antwort zu erhalten. Chatten Sie mit dem Team.', link: 'In Telegram schreiben →' },
      { icon: '✉', title: 'E-Mail', desc: 'Für offizielle Anfragen und Partnerschaftsvorschläge.', link: 'indexfastapp@gmail.com →' }
    ],
    seo: {
      title: 'Professionelle Unterstützung für Ihr SEO',
      text: 'Unser Support-Team besteht aus Spezialisten, die die Google Indexing API und technisches SEO verstehen.',
      items: [
        'Einrichtung von Google Cloud Console und Dienstkonten.',
        'Behebung von \'Seite nicht indexiert\'-Fehlern in der Search Console.',
        'Optimierung von API-Limits für große Projekte und Online-Shops.',
        'Integration von IndexFast in Ihre internen Arbeitsabläufe.'
      ]
    },
    info: [
      { title: 'Arbeitszeiten', desc: 'Mo–Fr 9:00–19:00 (Kiewer Zeit). Agency-Plan: Prioritäts-Support 24/7.' },
      { title: 'Partnerschaft', desc: 'SEO-Studio oder Entwickler? Partnerprogramm mit Auszahlungen bis zu 20% pro Abonnement.' },
      { title: 'Verantwortung', desc: 'Wir verwenden nur offiziell von Google empfohlene Indizierungsmethoden.' }
    ]
  },
  faqsPage: {
    title: 'Häufig gestellte Fragen',
    subtitle: 'Alles, was Sie über die Indizierung in der Google Search Console und IndexFast wissen müssen.',
    meta: {
      questions: '8 Fragen',
      updated: '2026'
    },
    cta: {
      title: 'Noch Fragen?',
      text: 'Unser Support-Team ist bereit, Ihnen bei allen Fragen zu IndexFast zu helfen.',
      btn: 'Schreiben Sie uns'
    }
  },
  affiliate: {
    badge: 'Partnerprogramm',
    title: 'Verdienen Sie mit <em>IndexFast</em>',
    subtitle: 'Empfehlen Sie IndexFast Ihrem Publikum und verdienen Sie bis zu 20% wiederkehrende Provision für jedes Abonnement.',
    ctaBtn: 'Partner werden →',
    cards: [
      { icon: '💰', title: 'Bis zu 20% Provision', desc: 'Verdienen Sie wiederkehrende Provision für jedes empfohlene Abonnement. Je mehr Kunden Sie bringen, desto mehr verdienen Sie.' },
      { icon: '📊', title: 'Echtzeit-Tracking', desc: 'Verfolgen Sie Ihre Empfehlungen, Klicks und Einnahmen in Echtzeit über unser Partner-Dashboard.' },
      { icon: '🎯', title: 'Marketingmaterialien', desc: 'Erhalten Sie Zugang zu Bannern, Logos und fertigen Inhalten zur effektiven Bewerbung von IndexFast.' }
    ]
  },
  status: {
    title: 'Alle Systeme betriebsbereit',
    subtitle: 'IndexFast läuft normal. Alle Dienste sind verfügbar.'
  },
  privacyPolicy: {
    title: 'Datenschutzrichtlinie',
    sections: [
      { title: 'Informationen, die wir sammeln', text: 'Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, z. B. beim Erstellen eines Kontos, Abonnieren unseres Dienstes oder Kontaktieren unseres Supports.' },
      { title: 'Wie wir Ihre Informationen verwenden', text: 'Wir verwenden die gesammelten Informationen zur Bereitstellung, Wartung und Verbesserung unserer Dienste, zur Abwicklung von Transaktionen und zur Kommunikation mit Ihnen.' },
      { title: 'Datensicherheit', text: 'Wir implementieren angemessene Sicherheitsmaßnahmen zum Schutz Ihrer persönlichen Informationen vor unbefugtem Zugriff, Änderung oder Offenlegung.' },
      { title: 'Kontaktieren Sie uns', text: 'Wenn Sie Fragen zu dieser Datenschutzrichtlinie haben, kontaktieren Sie uns bitte unter indexfastapp@gmail.com.' }
    ]
  },
  terms: {
    title: 'Nutzungsbedingungen',
    sections: [
      { title: 'Dienstbeschreibung', text: 'IndexFast bietet automatisierte Website-Indizierungsdienste unter Verwendung der Google Indexing API und des IndexNow-Protokolls.' },
      { title: 'Abonnement und Abrechnung', text: 'Wir bieten verschiedene Abonnementpläne an. Die Zahlung wird sicher über unsere Zahlungsanbieter abgewickelt. Abonnements verlängern sich automatisch, sofern sie nicht gekündigt werden.' },
      { title: 'Rückerstattungsrichtlinie', text: 'Wir bieten eine volle Rückerstattung innerhalb von 14 Tagen nach dem Kauf, wenn Sie mit unserem Dienst nicht zufrieden sind.' },
      { title: 'Kontaktieren Sie uns', text: 'Wenn Sie Fragen zu diesen Bedingungen haben, kontaktieren Sie uns bitte unter indexfastapp@gmail.com.' }
    ]
  },
  ltdPricing: {
    badge: '💰 Preise',
    title: 'Lifetime-Zugriff<br /><em>auf alle Funktionen</em>',
    subtitle: 'Einmalige Zahlung, keine wiederkehrenden Gebühren. Für immer nutzen!',
    cardBadge: 'Lifetime-Tarif',
    currency: '$',
    oldPrice: '250',
    newPrice: '120',
    cta: 'Loslegen',
    hurry: 'Beeilen Sie sich!!! Kaufen Sie jetzt, bevor der Preis steigt',
    whyTitle: 'Warum den Lifetime-Tarif wählen?',
    benefits: [
      { title: 'Unlimited access', desc: 'Unlimited access to all features available in the premium tiers without any monthly caps holding you back.' },
      { title: 'Free updates', desc: 'Free updates and new features. You will automatically receive all future improvements to the platform.' },
      { title: 'Premium support', desc: 'Premium support, always at your side. Get priority response from our dedicated support team.' },
      { title: 'One-time payment', desc: 'One-time payment, no surprises. Pay once and use the tool forever, completely eliminating subscription fatigue.' },
    ],
    comparisonHeaders: {
      type: 'Tariftyp',
      monthly: 'Monatlicher Tarif (Basic)',
      yearly: 'Jahres-Tarif (Basic)',
    },
    comparisonTitle: 'Tarife im Vergleich',
    comparison: [
      { feature: 'Preis', basic: '$10/Monat', yearly: '$96/Jahr', ltd: '$120 (war $250)' },
      { feature: 'Gesamtkosten (2 Jahre)', basic: '$240', yearly: '$192', ltd: '$120' },
      { feature: 'Zugriff auf Funktionen', basic: 'Alle', yearly: 'Alle', ltd: 'Alle' },
      { feature: 'Prioritäts-Support', basic: '✗', yearly: '✗', ltd: '✓' },
    ],
    features: {
      item1: '3 Websites',
      item2: 'Index up to 200 pages/day',
      item3: 'New/modified pages check (daily)',
      item4: 'Google auto indexing',
      item5: 'Unlimited URLs/website + Priority support',
    },
    faqTitle: 'Was können wir für Sie tun?',
    faqs: [
      { q: 'Was passiert, wenn ich nur Google Search Console benutze?', a: 'Gehen Sie zu Google Search Console (search.google.com/search-console), fügen Sie Ihre Website hinzu, senden Sie einen Sitemap und Google wird schließlich Ihre Website indizieren.' },
      { q: 'Benötigen Sie Zugriff auf mein Search Console?', a: 'Ja. Wir benötigen Zugriff auf Ihr Search Console, um Änderungen zu überwachen und Seiten automatisch zu indizieren.' },
      { q: 'Wie überprüfe ich, ob meine URLs indiziert sind?', a: 'Verwenden Sie die folgenden Methoden, um zu überprüfen, ob eine URL in Google indiziert ist.' },
      { q: 'Sind meine Daten sicher?', a: 'Datenschutz ist unsere oberste Priorität. Wir schützen Ihre Daten gemäß den Standards von GDPR und CCPA.' },
      { q: 'Wie ist die Rückerstattungsrichtlinie?', a: 'Aufgrund der Kosten für die Einrichtung eines Kontos bieten wir keine Rückerstattung an.' },
      { q: 'Kann ich den Tarif später ändern?', a: 'Sie können Ihren Tarif jederzeit über Ihren Billing-Portal aufrufen.' },
    ],
    purchase: {
      title: 'Wie Lifetime-Tarif kaufen?',
      desc: 'Gehen Sie zum IndexFast Dashboard und kaufen Sie den Lifetime-Tarif auf der Abrechnungsseite.',
      cta: 'Tarife anzeigen',
      contact: 'Fragen? <a href="{link}" style="color: var(--green);">Kontaktieren Sie uns</a>',
    }
  }
};
