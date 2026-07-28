export default {
  nav: {
    howItWorks: 'Jak to działa',
    forWhom: 'Dla kogo',
    features: 'Zalety',
    pricing: 'Ceny',
    faq: 'FAQ',
    signIn: 'Zaloguj się',
    getStarted: 'Zacznij za darmo →',
    lang: 'PL ▾'
  },
  hero: {
    badge: '⚡ Google Indexing API & IndexNow',
    title: 'Twoja strona w Google i Bing',
    titleEm: 'w 24 godziny',
    titleEnd: 'nie w tygodniach',
    subtitle: 'Przestań czekać, aż Google znajdzie Twoje strony. IndexFast wysyła je do indeksowania natychmiast przez oficjalne API.',
    ctaPrimary: '🚀 Zacznij za darmo',
    ctaSecondary: 'Jak to działa ↓',
    stats: {
      indexed: 'URL zindeksowanych',
      customers: 'Zadowolonych klientów',
      avgTime: 'Średni czas indeksowania',
      freePerDay: 'URL gratis/dzień'
    }
  },
  problem: {
    tag: 'Problem',
    title: 'Dlaczego Google ignoruje<br />Twoją stronę?',
    items: [
      { icon: '⏳', title: 'Googlebot rzadko indeksuje', desc: 'Nowe strony mogą czekać na indeksowanie od 2 tygodni do kilku miesięcy — Twoi konkurenci wyprzedzają Cię' },
      { icon: '📉', title: 'Ruch nie rośnie', desc: 'Dopóki strony nie są zindeksowane, są niewidoczne dla wyszukiwarek i nie przynoszą klientów' },
      { icon: '🔧', title: 'Search Console jest niewygodna', desc: 'Ręczne wysyłanie URL po jednym zajmuje godziny, a błędy API zniechęcają bez wiedzy technicznej.' }
    ],
    compareTitle: 'Czas do indeksowania',
    without: '❌ Bez IndexFast',
    with: '✅ Z IndexFast',
    withoutTime: '2–8 tygodni',
    withTime: '24–48 godzin',
    speedupLabel: '14× szybciej',
    speedupSub: 'średnie przyspieszenie indeksowania'
  },
  howItWorks: {
    tag: 'Jak to działa',
    title: 'Trzy kroki do<br />natychmiastowego indeksowania',
    subtitle: 'Konfiguracja zajmuje mniej niż 10 minut. Nie wymaga wiedzy technicznej.',
    steps: [
      { num: '01', icon: '🔑', title: 'Połącz Search Console', desc: 'Pobierz klucz JSON swojego Google Service Account i dodaj go do IndexFast. Razem i na zawsze.' },
      { num: '02', icon: '🗺️', title: 'Podaj URL sitemap', desc: 'Wpisz adres swojego sitemap.xml lub po prostu domenę — IndexFast znajdzie sitemap automatycznie.' },
      { num: '03', icon: '⚡', title: 'Uzyskaj wynik', desc: 'Wszystkie strony zostały wysłane do indeksowania. Uzyskaj szczegółowy raport i obserwuj wzrost ruchu.' }
    ]
  },
  features: {
    tag: 'Zalety',
    title: 'Wszystko co potrzebujesz<br />do topowych pozycji',
    subtitle: 'Wzięliśmy złożone Google Indexing API i przekształciliśmy je w proste narzędzie dla każdego biznesu.',
    items: [
      { icon: '🗺️', title: 'Wsparcie Sitemap Index', desc: 'Automatycznie parsuje zagnieżdżone sitemapy dowolnej głębokości — wszystkie URL zostaną znalezione i wysłane.' },
      { icon: '📊', title: 'Szczegółowy log', desc: 'Każda operacja jest zapisywana w pliku logu z czasem i statusem. Zawsze wiesz, co się stało i kiedy.' },
      { icon: '🛡️', title: 'Zarządzanie limitem', desc: 'Automatycznie przestrzega limitu Google 200 URL/dzień. Brak błędów przekroczenia limitu.' },
      { icon: '⚙️', title: 'Elastyczne uruchomienie', desc: 'CLI, argumenty, tryb interaktywny. Uruchamiaj ręcznie, przez cron lub pipeline CI/CD.' },
      { icon: '🚀', title: 'Oficjalne Google API', desc: 'Używa oficjalnego Google Indexing API — nie szare schematy, ale legalną i niezawodną metodę.' },
      { icon: '🔄', title: 'Automatyzacja', desc: 'Skonfiguruj automatyczne uruchomienie przez cron każdego dnia — nowe strony indeksują się same.' }
    ]
  },
integrations: {
     label: 'Działa z dowolną platformą',
     footer: 'Jeśli Twoja strona ma <strong>sitemap.xml</strong> — IndexFast z nią pracuje'
   },
   scroll: 'Przewijaj',
   period: 'miesięcznie',
  forWhom: {
    tag: 'Dla kogo',
    title: 'IndexFast działa<br />dla dowolnego biznesu',
    subtitle: 'Od blogerów po agencje — jeśli masz stronę i chcesz ruch z Google, IndexFast jest dla Ciebie.',
    items: [
      { emoji: '🛒', title: 'Sklepy internetowe', desc: 'Setki i tysiące stron produktowych, które Google nie ma czasu skanować. IndexFast gwarantuje, że każdy nowy produkt trafi do wyszukiwania jak najszybciej.', tags: ['WooCommerce', 'OpenCart', 'Shopify', 'Prom.ua'] },
      { emoji: '✍️', title: 'Blogerzy i media', desc: 'Publikujesz content codziennie? Nowe artykuły pojawiają się w wyszukiwarce już następnego ranka, nie tygodniami. Twój content zajmuje pierwsze miejsca, podczas gdy konkurenci czekają.', tags: ['WordPress', 'Ghost', 'Portale informacyjne'] },
      { emoji: '🏢', title: 'Strony biznesowe', desc: 'Zaktualizowane usługi, dodane case studies lub zmienione ceny? IndexFast natychmiast sygnalizuje Google o zmianach. Aktualne informacje w wynikach wyszukiwania bez opóźnień.', tags: ['Landingi', 'Strony korporacyjne'] },
      { emoji: '🏠', title: 'Nieruchomości i classifieds', desc: 'Nowe obiekty pojawiają się codziennie. Kupujący szukają w Google właśnie teraz — każda minuta opóźnienia indeksowania kosztuje Cię klienta.', tags: ['DOM.RIA', 'Agregatory', 'Tablice ogłoszeń'] },
      { emoji: '🎯', title: 'Specjaliści SEO i agencje', desc: 'Zarządzasz wieloma projektami? Plan Agency pozwala zarządzać do 50 stronami klientów z jednego konta i generować raporty white-label.', tags: ['Multisite', 'White-label', 'API'] },
      { emoji: '🚀', title: 'Startupy i SaaS', desc: 'Wprowadzasz nowy produkt? Szybkie indeksowanie Twojego landingu i bloga oznacza pierwszych organicznych użytkowników z zerowym budżetem na reklamy — już w pierwszym tygodniu.', tags: ['Product Hunt', 'Landingi', 'Blog'] }
    ]
  },
  testimonials: {
    tag: 'Opinie klientów',
    title: 'Oni już są na szczycie Google',
    items: [
      { badge: '+340% ruchu organicznego', stars: '★★★★★', text: '"Uruchomiłem sklep internetowy — 800 produktów, z których żaden nie był indeksowany przez tygodnie. Po IndexFast w 2 dni wszystkie strony były w Google. Ruch wzrósł 4 razy w pierwszym miesiącu."', name: 'Andriy Kovalenko', role: 'Właściciel sklepu internetowego, Kijów', initials: 'AK' },
      { badge: 'Indeksacja w 18 godzin', stars: '★★★★★', text: '"Bloguję o podróżach — publikuję 3-4 artykuły na tydzień. Wcześniej czekałem na indeksację do 3 tygodni. Teraz nowy artykuł jest w obiegu już następnego ranka. To zmieniło wszystkie zasady gry!"', name: 'Maryna Sydorenko', role: 'Blogerka, 50k obserwujących', initials: 'MS' },
      { badge: 'Klienci z Google od 1. tygodnia', stars: '★★★★★', text: '"Uruchomiliśmy landing dla nowego produktu. Dzięki IndexFast otrzymaliśmy pierwszych klientów w ciągu tygodnia. Organiczne SEO wreszcie działa tak, jak powinno."', name: 'Dmytro Petrenko', role: 'CEO SaaS startupu', initials: 'DP' },
      { badge: 'Oszczędność 8 godzin/tydzień', stars: '★★★★★', text: '"Obsługuję 15 stron klientów. Wcześniej spędzałem godziny na ręczne wysyłanie URL przez Search Console. Teraz jeden skrypt obsługuje wszystkich klientów automatycznie każdego dnia."', name: 'Oleg Morozenko', role: 'Specjalista SEO, freelancer', initials: 'OHM' },
      { badge: 'Top 3 w 2 tygodnie', stars: '★★★★★', text: '"Kancelaria prawna, bardzo konkurencyjna nisza. Zaktualizowałem strony usług — IndexFast wysłał je natychmiast. W 2 tygodnie byliśmy w top 3 za kluczowe frazy. Niewiarygodne!"', name: 'Natalia Zakharenko', role: 'Marketer kancelarii prawnej', initials: 'NZ' },
      { badge: '200 → 2400 odwiedzających/dzień', stars: '★★★★★', text: '"Portal informacyjny — publikujemy 20+ materiałów na dzień. IndexFast uruchamia się automatycznie w cron. Ruch wzrósł z 200 do 2 400 unikalnych odwiedzających na miesiąc."', name: 'Vasyl Kravchenko', role: 'Główny redaktor mediów', initials: 'VK' }
    ]
  },
  pricing: {
    tag: 'Ceny',
    title: 'Sprawdzone ceny,<br />brak ukrytych opłat',
    subtitle: 'Zacznij za darmo. Płać tylko gdy widzisz rezultat'
  },
  roi: {
    label: 'Kalkulator',
    title: 'Ile zaoszczędzisz<br />z IndexFast?',
    subtitle: 'Dostosuj ustawienia dla swojego biznesu — a zobaczysz realny korzyść w czasie i pieniądzach.',
    fields: {
      pages: 'Stron na stronie',
      newPages: 'Nowych stron na miesiąc',
      rate: 'Twój stawka ($/godzina)',
      minsPer: 'Minut na ręczne indeksowanie 1 URL'
    },
    results: {
      timeLabel: 'Czas zaoszczędzony na indeksowaniu',
      costLabel: 'Koszt tego czasu',
      speedLabel: 'Przyspieszenie indeksowania',
      speedValue: 'do 14×',
      speedSub: 'z tygodni na 24 godziny',
      netBenefitLabel: 'Netto korzyść (oszczędności - koszt PRO)',
      profitLabel: 'czysty zysk na miesiąc',
      lossLabel: 'różnica (rozważ PRO dla większych wolumenów)',
      actionLabel: 'Uzyskaj korzyść →'
    }
  },
  faq: {
    tag: 'FAQ',
    title: 'Najczęściej zadawane pytania',
    items: [
      { q: 'Jak szybko Google zindeksuje moje strony?', a: 'Po wysłaniu przez IndexFast Google zazwyczaj indeksuje strony w ciągu 24-48 godzin. Normalne, jeśli skanowanie Googlebota może trwać od 2 tygodni do kilku miesięcy.' },
      { q: 'Ile URL mogę wysyłać za darmo?', a: 'Google zapewnia limit 200 URL na dzień za darmo przez API indeksowania. Plan Free IndexFast automatycznie zarządza tym limitem. Limit można rozszerzyć na planach Pro i Agency.' },
      { q: 'Czy wymagana jest wiedza techniczna?', a: 'Do podstawowego użycia wystarczy połączyć konto Google Search Console i podać URL sitemap.xml. Instrukcje krok po kroku są dołączone. Do automatyzacji przez cron potrzebne będą podstawowe knowledże Linux.' },
      { q: 'Czy to oficjalna metoda? Google nie zbanuje strony?', a: 'IndexFast używa tylko oficjalnego Google Indexing API. Jest to zalecana przez Google metoda przyspieszenia indeksowania. Brak ryzyka dla Twojej strony.' },
      { q: 'A co z innymi wyszukiwaremi (Bing, Naver)?', a: 'Tak, IndexFast również w pełni obsługuje protokół IndexNow. Oznacza to, że Twoje linki są automatycznie wysyłane nie tylko do Google, ale również do Bing, Naver, Seznam.cz i Yep jednocześnie.' },
      { q: 'A jeśli moja strona jest na WordPress / Webflow / innej platformie?', a: 'IndexFast działa z dowolną stroną, która ma sitemap.xml — WordPress, Webflow, Wix, niestandardowa. Jeśli Twoja strona ma sitemap — IndexFast z nią pracuje.' },
      { q: 'Jak skonfigurować automatyczne uruchomienie każdego dnia?', a: 'Plany Pro i Agency mają wbudowany planer. Na planie free można skonfigurować zadanie cron na serwerze — szczegółowe instrukcje w dokumentacji.' },
      { q: 'Czy jest zwrot środków?', a: 'Tak, oferujemy gwarancję pełnego zwrotu środków w ciągu 14 dni od płatności, jeśli serwis nie spełnił Twoich oczekiwań. Zapytania pisz na indexfastapp@gmail.com.' }
    ]
  },
  blog: {
    tag: 'Przydatne materiały',
    title: 'Czytaj nasz blog',
    subtitle: 'Praktyczne porady o SEO, indeksowaniu i promocji w Google',
    introText: 'Praktyczne porady o SEO, indeksowaniu i promocji w Google',
    readMore: 'Wszystkie artykuły →',
    readArticle: 'Czytać artykuł →',
    articles: [
      { href: '/blog/yak-pryskoriti-indeksaciyu-saitu-v-google', tag: 'Indeksowanie', readTime: '10 minut czytania', title: 'Jak przyspieszyć indeksowanie witryny w Google w 2025', desc: 'Przewodnik krok po kroku: od konfiguracji mapy witryny do Google Indexing API. Prawdziwe metody, które działają.' },
      { href: '/blog/shcho-take-sitemap-xml', tag: 'SEO', readTime: '7 minut czytania', title: 'Co to jest sitemap.xml i dlaczego potrzebujesz?', desc: 'Pełna analiza: struktura, typy, błędy i jak poprawnie skonfigurować mapę witryny dla Google.' },
    ],
    ctaArticles: {
      title: 'Więcej artykułów o SEO i indeksowaniu',
      desc: 'Praktyczne porady, przypadki i wskazówki co tydzień'
    }
  },
  cta: {
    tag: 'Zacznij teraz',
    title: 'Kiedy czytasz—',
    titleEm: 'konkurenci już są w top',
    subtitle: 'Dołącz do 247+ stron, które już otrzymują klientów z Google z IndexFast.',
    trust: ['Za darmo na zawsze', 'Bez karty kredytowej', 'Oficjalne Google API']
  },
  footer: {
    brandDesc: 'Serwis do automatycznego indeksowania stron w Google przez oficjalne Google Indexing API.',
    product: {
      howItWorks: 'Jak to działa',
      features: 'Zalety',
      pricing: 'Taryfy',
      docs: 'Dokumentacja'
    },
    company: {
      about: 'O nas',
      blog: 'Blog',
      affiliate: 'Program partnerski',
      contacts: 'Kontakt'
    },
    support: {
      faq: 'FAQ',
      telegram: 'Czat Telegram',
      email: 'Wsparcie email',
      status: 'Status serwisu'
    },
    copyright: '© 2026 IndexFast. Wszelkie prawa zastrzeżone.',
    privacy: 'Prywatność',
    terms: 'Warunki'
  },
  about: {
    eyebrow: 'Nasz zespół',
    title: 'Budujemy narzędzia<br />dla <em>szybkiego indeksowania</em>',
    lead: 'IndexFast to ukraiński zespół budujący narzędzia do szybkiego indeksowania w Google. Dowiedz się o naszej misji, wartościach i ludziach za produktem.',
    mission: {
      label: 'Misja',
      title: 'Robimy SEO transparentnym i efektywnym',
      text: 'Wierzymy, że każda strona zasługuje na znalezienie w Google. Nasza misja — uprościć proces indeksowania i uczynić profesjonalne narzędzia SEO dostępnymi dla wszystkich. IndexFast został stworzony, aby uczynić SEO bardziej transparentnym i efektywnym. Używamy tylko oficjalnie rekomendowanych przez Google metod indeksowania.'
    },
    values: [
      { icon: '⚡', title: 'Szybkość', desc: 'Optymalizujemy każdy proces, aby dostarczać wyniki w godzinach, a nie tygodniach.' },
      { icon: '🛡️', title: 'Bezpieczeństwo', desc: 'Tylko oficjalne Google API. Brak ryzyka dla Twojej strony.' },
      { icon: '💎', title: 'Transparentność', desc: 'Jasne ceny, szczegółowe logi, brak ukrytych opłat.' }
    ],
    team: {
      label: 'Zespół',
      title: 'Ludzie za IndexFast',
      sub: 'Mały zespół z dużymi ambicjami w SEO'
    },
    teamCards: [
      { name: 'Roman Matviy', role: 'Założyciel i Deweloper', bio: 'Full-stack developer i entuzjasta SEO. Zbudował IndexFast, aby rozwiązać realne problemy indeksowania.' },
      { name: 'Andriy K.', role: 'Specjalista SEO', bio: 'Specjalista SEO z ponad 8-letnim doświadczeniem. Zapewnia, że IndexFast przestrzega najlepszych praktyk.' },
      { name: 'Maryna S.', role: 'Projektantka Produktu', bio: 'Tworzy intuicyjne interfejsy, które sprawiają, że złożone zadania SEO są proste dla wszystkich.' }
    ],
    ukraine: {
      title: 'Z dumą ukraińskie',
      text: 'IndexFast urodził się na Ukrainie. Jesteśmy zaangażowani w tworzenie narzędzi SEO światowej klasy, wspieranie naszej społeczności i wkładanie w ekosystem technologiczny.',
      badge: '⚡ Stworzone na Ukrainie'
    },
    cta: {
      title: 'Gotowy przyspieszyć indeksowanie?',
      subtitle: 'Dołącz do setek stron, które już używają IndexFast',
      btnPrimary: 'Zacznij za darmo →',
      btnSecondary: 'Skontaktuj się z nami'
    }
  },
  contacts: {
    eyebrow: 'Jesteśmy w kontakcie',
    title: 'Kontakt i <em>wsparcie</em>',
    lead: 'Masz pytania? Wybierz wygodny sposób kontaktu — odpowiemy jak najszybciej.',
    cards: [
      { icon: '✈', title: 'Wsparcie Telegram', desc: 'Najszybszy sposób na odpowiedź. Czytaj z zespołem.', link: 'Napisz na Telegram →' },
      { icon: '✉', title: 'Email', desc: 'Dla oficjalnych zapytań i propozycji partnerskich.', link: 'indexfastapp@gmail.com →' }
    ],
    seo: {
      title: 'Profesjonalne wsparcie dla Twojego SEO',
      text: 'Nasz zespół wsparcia składa się z specjalistów, którzy rozumieją Google Indexing API i techniczne SEO.',
      items: [
        'Konfiguracja Google Cloud Console i kont serwisowych.',
        'Rozwiązywanie błędów \'Strona nie jest zindeksowana\' w Search Console.',
        'Optymalizacja limitów API dla dużych projektów i sklepów internetowych.',
        'Integracja IndexFast z Twoimi wewnętrznymi workflows.'
      ]
    },
    info: [
      { title: 'Godziny pracy', desc: 'Pn–Pt 9:00–19:00 (czas kijowski). Plan Agency: priorytetowe wsparcie 24/7.' },
      { title: 'Partnerstwo', desc: 'Studio SEO lub deweloper? Program partnerski z wypłatami do 20% za subskrypcję.' },
      { title: 'Odpowiedzialność', desc: 'Używamy tylko oficjalnie rekomendowanych przez Google metod indeksowania.' }
    ]
  },
  faqsPage: {
    title: 'Najczęściej zadawane pytania',
    subtitle: 'Wszystko co musisz wiedzieć o indeksowaniu w Google Search Console i IndexFast.',
    meta: {
      questions: '8 pytań',
      updated: '2026'
    },
    cta: {
      title: 'Zostały pytania?',
      text: 'Nasz zespół wsparcia jest gotowy pomóc Ci z dowolnymi pytaniami o IndexFast.',
      btn: 'Napisz do nas'
    }
  },
  affiliate: {
    badge: 'Program partnerski',
    title: 'Zarabiaj z <em>IndexFast</em>',
    subtitle: 'Polecaj IndexFast swojej publiczności i zarabiaj do 20% powtarzającej się komisji za każdą subskrypcję.',
    ctaBtn: 'Zostań partnerem →',
    cards: [
      { icon: '💰', title: 'Do 20% komisji', desc: 'Zarabiaj powtarzającą się komisję za każdą poleconą subskrypcję. Im więcej klientów przywołasz, tym więcej zarabiasz.' },
      { icon: '📊', title: 'Śledzenie w czasie rzeczywistym', desc: 'Śledź swoje polecenia, kliknięcia i zarobki w czasie rzeczywistym przez nasz panel partnerski.' },
      { icon: '🎯', title: 'Materiały marketingowe', desc: 'Uzyskaj dostęp do banerów, logo i gotowych treści do efektywnej promocji IndexFast.' }
    ]
  },
  status: {
    title: 'Wszystkie systemy operacyjne',
    subtitle: 'IndexFast działa normalnie. Wszystkie usługi są dostępne.'
  },
  privacyPolicy: {
    title: 'Polityka Prywatności',
    sections: [
      { title: 'Informacje które zbieramy', text: 'Zbieramy informacje które nam dostarczasz bezpośrednio, na przykład przy tworzeniu konta, subskrypcji naszego serwisu lub kontakcie z naszym wsparciem.' },
      { title: 'Jak wykorzystujemy Twoje informacje', text: 'Wykorzystujemy zebrane informacje do świadczenia, utrzymania i ulepszania naszych usług, przetwarzania transakcji i komunikacji z Tobą.' },
      { title: 'Bezpieczeństwo danych', text: 'Wdrażamy odpowiednie środki bezpieczeństwa, aby chronić Twoje dane osobowe przed nieautoryzowanym dostępem, zmianą lub ujawnieniem.' },
      { title: 'Skontaktuj się z nami', text: 'Jeśli masz pytania dotyczące tej Polityki Prywatności, skontaktuj się z nami pod adresem indexfastapp@gmail.com.' }
    ]
  },
  terms: {
    title: 'Warunki Korzystania',
    sections: [
      { title: 'Opis serwisu', text: 'IndexFast świadczy automatyczne usługi indeksowania stron internetowych za pomocą Google Indexing API i protokołu IndexNow.' },
      { title: 'Subskrypcja i rozliczenia', text: 'Oferujemy różne plany subskrypcyjne. Płatności są przetwarzane bezpiecznie przez naszych dostawców płatności. Subskrypcje są automatycznie odnawiane, chyba że anulowane.' },
      { title: 'Polityka zwrotów', text: 'Oferujemy pełny zwrot środków w ciągu 14 dni od zakupu, jeśli nie jesteś zadowolony z naszego serwisu.' },
      { title: 'Skontaktuj się z nami', text: 'Jeśli masz pytania dotyczące tych warunków, skontaktuj się z nami pod adresem indexfastapp@gmail.com.' }
    ]
  },
  ltdPricing: {
    badge: '💰 Ceny',
    title: 'Dostęp na całe życie<br /><em>do wszystkich funkcji</em>',
    subtitle: 'Jednorazowa płatność, bez opłat cyklicznych. Używaj na zawsze!',
    cardBadge: 'Plan na całe życie',
    currency: '$',
    oldPrice: '250',
    newPrice: '120',
    cta: 'Rozpocznij',
    hurry: 'Pośpiesz się!!! Kup teraz, zanim cena wzrośnie',
    whyTitle: 'Dlaczego wybrać plan na całe życie?',
    benefits: [
      { title: 'Unlimited access', desc: 'Unlimited access to all features available in the premium tiers without any monthly caps holding you back.' },
      { title: 'Free updates', desc: 'Free updates and new features. You will automatically receive all future improvements to the platform.' },
      { title: 'Premium support', desc: 'Premium support, always at your side. Get priority response from our dedicated support team.' },
      { title: 'One-time payment', desc: 'One-time payment, no surprises. Pay once and use the tool forever, completely eliminating subscription fatigue.' },
    ],
    comparisonHeaders: {
      type: 'Typ planu',
      monthly: 'Plan Miesięczny (Podstawowy)',
      yearly: 'Plan Roczny (Podstawowy)',
    },
    comparisonTitle: 'Porównanie planów',
    comparison: [
      { feature: 'Cena', basic: '$10/miesiąc', yearly: '$96/rok', ltd: '$120 (było $250)' },
      { feature: 'Całkowity koszt (2 lata)', basic: '$240', yearly: '$192', ltd: '$120' },
      { feature: 'Dostęp do funkcji', basic: 'Wszystkie', yearly: 'Wszystkie', ltd: 'Wszystkie' },
      { feature: 'Priorytetowe wsparcie', basic: '✗', yearly: '✗', ltd: '✓' },
    ],
    features: {
      item1: '3 strony internetowe',
      item2: 'Indeksowanie do 200 stron/dzień',
      item3: 'Sprawdzanie nowych/zmienionych stron (codziennie)',
      item4: 'Automatyczna indeksacja Google',
      item5: 'Nieograniczona liczba URL/strona + priorytetowe wsparcie',
    },
    faqTitle: 'Jak możemy pomóc?',
    faqs: [
      { q: 'Co się stanie, jeśli używam tylko Google Search Console?', a: 'Przejdź do Google Search Console (search.google.com/search-console), dodaj swoją witrynę, wyślij mapę sitemap, i Google w końcu zaindeksuje Twoją witrynę.' },
      { q: 'Czy potrzebujecie dostępu do mojego Search Console?', a: 'Tak. Prosimy o dostęp do Twojego Search Console, aby regularnie sprawdzać zmiany i automatycznie indeksować strony.' },
      { q: 'Jak sprawdzić, czy moje URL są zaindeksowane?', a: 'Użyj poniższych metod, aby określić, czy URL jest zaindeksowany w Google.' },
      { q: 'Czy moje dane są bezpieczne?', a: 'Ochrona danych jest naszym priorytetem. Chronimy Twoje dane zgodnie z normami GDPR i CCPA.' },
      { q: 'Jakie jest prawo do zwrotu?', a: 'Z powodu kosztów konfiguracji nie oferujemy zwrotów. Możesz anulować w dowolnym momencie.' },
      { q: 'Czy mogę zmienić plan później?', a: 'Możesz aktualizować/obniżać swój plan w dowolnym momencie z poziomu swojego portfela.' },
    ],
    purchase: {
      title: 'Jak kupić plan na całe życie?',
      desc: 'Przejdź do dashboardu IndexFast i kup plan na całe życie na stronie płatności.',
      cta: 'Zobacz plany',
      contact: 'Pytania? <a href="{link}" style="color: var(--green);">Skontaktuj się z nami</a>',
    }
  }
};
