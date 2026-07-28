export default {
  nav: {
    howItWorks: 'Como funciona',
    forWhom: 'Para quem',
    features: 'Vantagens',
    pricing: 'Preços',
    faq: 'FAQ',
    signIn: 'Entrar',
    getStarted: 'Começar grátis →',
    lang: 'PT ▾'
  },
  hero: {
    badge: '⚡ Google Indexing API & IndexNow',
    title: 'Seu site no Google e Bing',
    titleEm: 'em 24 horas',
    titleEnd: 'não em semanas',
    subtitle: 'Pare de esperar que o Google encontre suas páginas. IndexFast envia-as para indexação instantaneamente via API oficial.',
    ctaPrimary: '🚀 Começar grátis',
    ctaSecondary: 'Como funciona ↓',
    stats: {
      indexed: 'URLs indexados',
      customers: 'Clientes satisfeitos',
      avgTime: 'Tempo médio de indexação',
      freePerDay: 'URLs grátis/dia'
    }
  },
  problem: {
    tag: 'Problema',
    title: 'Por que o Google está ignorando<br />seu site?',
    items: [
      { icon: '⏳', title: 'Googlebot raramente rastreia', desc: 'Novas páginas podem esperar de 2 semanas a vários meses para serem indexadas — seus concorrentes estão ultrapassando você' },
      { icon: '📉', title: 'O tráfego não está crescendo', desc: 'Enquanto as páginas não estiverem indexadas, elas estão invisíveis para os motores de busca e não trazem clientes' },
      { icon: '🔧', title: 'Search Console é inconveniente', desc: 'Enviar URLs manualmente uma por uma demora horas e erros de API assustam sem conhecimento técnico.' }
    ],
    compareTitle: 'Tempo para indexação',
    without: '❌ Sem IndexFast',
    with: '✅ Com IndexFast',
    withoutTime: '2–8 semanas',
    withTime: '24–48 horas',
    speedupLabel: '14× mais rápido',
    speedSub: 'aceleração média de indexação'
  },
  howItWorks: {
    tag: 'Como funciona',
    title: 'Três passos para a<br />indexação instantânea',
    subtitle: 'A configuração demora menos de 10 minutos. Não é necessário conhecimento técnico.',
    steps: [
      { num: '01', icon: '🔑', title: 'Conectar Search Console', desc: 'Baixe a chave JSON da sua Google Service Account e adicione-a ao IndexFast. Uma vez e para sempre.' },
      { num: '02', icon: '🗺️', title: 'Especificar o URL do sitemap', desc: 'Digite o endereço do seu sitemap.xml ou apenas o domínio — IndexFast encontrará o sitemap automaticamente.' },
      { num: '03', icon: '⚡', title: 'Obter o resultado', desc: 'Todas as páginas são enviadas para indexação. Obtenha um relatório detalhado e veja seu tráfego crescer.' }
    ]
  },
  features: {
    tag: 'Vantagens',
    title: 'Tudo o que você precisa<br />para as primeiras posições',
    subtitle: 'Pegamos a complexa Google Indexing API e a transformamos em uma ferramenta simples para qualquer negócio.',
    items: [
      { icon: '🗺️', title: 'Suporte a Sitemap Index', desc: 'Analisa automaticamente sitemaps aninhados de qualquer profundidade — todas as URLs serão encontradas e enviadas.' },
      { icon: '📊', title: 'Log detalhado', desc: 'Cada operação é registrada em um arquivo de log com hora e status. Você sempre sabe o que aconteceu e quando.' },
      { icon: '🛡️', title: 'Gerenciamento de cota', desc: 'Respeita automaticamente o limite de 200 URLs/dia do Google. Sem erros de excesso de cota.' },
      { icon: '⚙️', title: 'Início flexível', desc: 'CLI, argumentos, modo interativo. Execute manualmente, via cron ou pipeline CI/CD.' },
      { icon: '🚀', title: 'API oficial do Google', desc: 'Usa a API oficial do Google Indexing — não esquemas cinza, mas um método legal e confiável.' },
      { icon: '🔄', title: 'Automação', desc: 'Configure um início automático via cron todos os dias — novas páginas serão indexadas sozinhas.' }
    ]
  },
integrations: {
     label: 'Funciona com qualquer plataforma',
     footer: 'Se seu site tem <strong>sitemap.xml</strong> — IndexFast funciona com ele'
   },
   scroll: 'Rolar',
   period: 'por mês',
  forWhom: {
    tag: 'Para quem',
    title: 'IndexFast funciona<br />para qualquer negócio',
    subtitle: 'De blogueiros a agências — se você tem um site e quer tráfego do Google, IndexFast é para você.',
    items: [
      { emoji: '🛒', title: 'Lojas online', desc: 'Centenas e milhares de páginas de produtos que o Google não tem tempo de escanear. IndexFast garante que cada novo produto apareça na busca o mais rápido possível.', tags: ['WooCommerce', 'OpenCart', 'Shopify', 'Prom.ua'] },
      { emoji: '✍️', title: 'Blogueiros e mídias', desc: 'Publicando conteúdo todos os dias? Novos artigos aparecem na busca na manhã seguinte, não semanas depois. Seu conteúdo ranqueia primeiro enquanto concorrentes esperam.', tags: ['WordPress', 'Ghost', 'Portais de notícias'] },
      { emoji: '🏢', title: 'Sites empresariais', desc: 'Serviços atualizados, estudos de caso adicionados ou preços alterados? IndexFast sinaliza instantaneamente ao Google sobre alterações. Informações atualizadas nos resultados de busca sem demora.', tags: ['Landings', 'Sites corporativos'] },
      { emoji: '🏠', title: 'Imóveis e classificados', desc: 'Novos objetos aparecem todos os dias. Compradores estão buscando no Google agora mesmo — cada minuto de atraso na indexação custa um cliente.', tags: ['DOM.RIA', 'Agregadores', 'Quadros de avisos'] },
      { emoji: '🎯', title: 'Especialistas SEO e agências', desc: 'Gerenciando múltiplos projetos? O plano Agency permite gerenciar até 50 sites de clientes de uma conta e gerar relatórios white-label.', tags: ['Multisite', 'White-label', 'API'] },
      { emoji: '🚀', title: 'Startups e SaaS', desc: 'Lançando um novo produto? A indexação rápida do seu landing page e blog significa primeiros usuários orgânicos com zero gasto em anúncios — já na primeira semana.', tags: ['Product Hunt', 'Landings', 'Blog'] }
    ]
  },
  testimonials: {
    tag: 'Avaliações de clientes',
    title: 'Eles já estão no topo do Google',
    items: [
      { badge: '+340% tráfego orgânico', stars: '★★★★★', text: '"Lancei uma loja online — 800 produtos, nenhum indexado por semanas. Depois do IndexFast em 2 dias todas as páginas estavam no Google. O tráfego aumentou 4 vezes no primeiro mês."', name: 'Andriy Kovalenko', role: 'Proprietário de loja online, Kiev', initials: 'AK' },
      { badge: 'Indexação em 18 horas', stars: '★★★★★', text: '"Eu blogo sobre viagens — publico 3-4 artigos por semana. Antes esperava até 3 semanas para indexação. Agora o novo artigo está em circulação já na manhã seguinte. Mudou o jogo!"', name: 'Maryna Sydorenko', role: 'Blogueira, 50k seguidores', initials: 'MS' },
      { badge: 'Clientes do Google desde a 1ª semana', stars: '★★★★★', text: '"Lançamos uma landing page para um novo produto. Graças ao IndexFast, recebemos nossos primeiros clientes em uma semana. O SEO orgânico finalmente funciona como deveria."', name: 'Dmytro Petrenko', role: 'CEO de um SaaS startup', initials: 'DP' },
      { badge: 'Economia de 8 horas/semana', stars: '★★★★★', text: '"Atendo 15 sites de clientes. Costumava passar horas enviando URLs manualmente via Search Console. Agora um script gerencia todos os clientes automaticamente todos os dias."', name: 'Oleg Morozenko', role: 'Especialista SEO, freelancer', initials: 'OHM' },
      { badge: 'Top 3 em 2 semanas', stars: '★★★★★', text: '"Escritório de advocacia, nicho muito competitivo. Atualizei as páginas de serviços — IndexFast enviou-as instantaneamente. Em 2 semanas estávamos no top 3 para palavras-chave. Incrível!"', name: 'Natalia Zakharenko', role: 'Marketer de escritório de advocacia', initials: 'NZ' },
      { badge: '200 → 2400 visitantes/dia', stars: '★★★★★', text: '"Portal de notícias — publicamos 20+ materiais por dia. IndexFast inicia automaticamente no cron. O tráfego cresceu de 200 para 2.400 visitantes únicos por mês."', name: 'Vasyl Kravchenko', role: 'Editor-chefe de mídia', initials: 'VK' }
    ]
  },
  pricing: {
    tag: 'Preços',
    title: 'Preços justos,<br />sem taxas ocultas',
    subtitle: 'Comece grátis. Pague apenas quando ver resultado'
  },
  roi: {
    label: 'Calculadora',
    title: 'Quanto você economiza<br />com IndexFast?',
    subtitle: 'Personalize as configurações para seu negócio — e você verá um benefício real em tempo e dinheiro.',
    fields: {
      pages: 'Páginas no site',
      newPages: 'Novas páginas por mês',
      rate: 'Seu preço ($/hora)',
      minsPer: 'Minutos para indexar manualmente 1 URL'
    },
    results: {
      timeLabel: 'Tempo economizado na indexação',
      costLabel: 'Custo deste tempo',
      speedLabel: 'Aceleração da indexação',
      speedValue: 'até 14×',
      speedSub: 'de semanas para 24 horas',
      netBenefitLabel: 'Benefício líquido (economia - custo PRO)',
      profitLabel: 'lucro líquido por mês',
      lossLabel: 'diferença (considere PRO para volumes maiores)',
      actionLabel: 'Obter benefício →'
    }
  },
  faq: {
    tag: 'FAQ',
    title: 'Perguntas frequentes',
    items: [
      { q: 'Quão rápido o Google indexará minhas páginas?', a: 'Depois de enviadas através do IndexFast, o Google normalmente indexa páginas em 24-48 horas. É normal que uma verificação do Googlebot possa demorar de 2 semanas a vários meses.' },
      { q: 'Quantas URLs posso enviar gratuitamente?', a: 'O Google fornece uma cota de 200 URLs por dia gratuitamente através da Indexing API. O Plano Free do IndexFast gerencia essa cota automaticamente. A cota pode ser expandida nos planos Pro e Agency.' },
      { q: 'Conhecimento técnico é necessário?', a: 'Para uso básico, você só precisa conectar uma conta Google Search Console e especificar um URL sitemap.xml. Instruções passo a passo estão incluídas. Para automação via cron, você precisará de conhecimentos básicos de Linux.' },
      { q: 'Este é o método oficial? O Google não banirá o site?', a: 'IndexFast usa apenas a API oficial do Google Indexing. Este é o método recomendado pelo Google para aceleração de indexação. Nenhum risco para seu site.' },
      { q: 'E sobre outros motores de busca (Bing, Naver)?', a: 'Sim, o IndexFast também suporta totalmente o protocolo IndexNow. Isso significa que seus links são enviados automaticamente não apenas para o Google, mas também para Bing, Naver, Seznam.cz e Yep simultaneamente.' },
      { q: 'E se meu site estiver no WordPress / Webflow / outra plataforma?', a: 'IndexFast funciona com qualquer site que tenha sitemap.xml — WordPress, Webflow, Wix, personalizado. Se seu site tem sitemap — IndexFast funciona com ele.' },
      { q: 'Como configurar a inicialização automática todos os dias?', a: 'Os planos Pro e Agency têm um planejador integrado. No plano free, você pode configurar uma tarefa cron no servidor — instruções detalhadas na documentação.' },
      { q: 'Há reembolso?', a: 'Sim, oferecemos uma garantia de reembolso total dentro de 14 dias após o pagamento se o serviço não atendê-lo. Para consultas, escreva para indexfastapp@gmail.com.' }
    ]
  },
  blog: {
    tag: 'Materiais úteis',
    title: 'Leia nosso blog',
    subtitle: 'Guias práticos sobre SEO, indexação e promoção no Google',
    introText: 'Guias práticos sobre SEO, indexação e promoção no Google',
    readMore: 'Todos os artigos →',
    readArticle: 'Ler artigo →',
    articles: [
      { href: '/blog/yak-pryskoriti-indeksaciyu-saitu-v-google', tag: 'Indexação', readTime: '10 minutos de leitura', title: 'Como acelerar a indexação do seu site no Google em 2025', desc: 'Guia passo a passo: da configuração do sitemap até a API Google Indexing. Métodos reais que funcionam.' },
      { href: '/blog/shcho-take-sitemap-xml', tag: 'SEO', readTime: '7 minutos de leitura', title: 'O que é sitemap.xml e por que você precisa?', desc: 'Análise completa: estrutura, tipos, erros e como configurar corretamente a sitemap para o Google.' },
    ],
    ctaArticles: {
      title: 'Mais artigos sobre SEO e indexação',
      desc: 'Guias práticos, casos e dicas toda semana'
    }
  },
  cta: {
    tag: 'Comece agora',
    title: 'Enquanto você lê—',
    titleEm: 'os concorrentes já estão no top',
    subtitle: 'Junte-se a mais de 247 sites que já recebem clientes do Google com IndexFast.',
    trust: ['Grátis para sempre', 'Sem cartão de crédito', 'API oficial do Google']
  },
  footer: {
    brandDesc: 'Serviço para indexação automática de páginas de sites no Google através da API oficial Google Indexing.',
    product: {
      howItWorks: 'Como funciona',
      features: 'Vantagens',
      pricing: 'Tarifas',
      docs: 'Documentação'
    },
    company: {
      about: 'Sobre nós',
      blog: 'Blog',
      affiliate: 'Programa de afiliados',
      contacts: 'Contatos'
    },
    support: {
      faq: 'FAQ',
      telegram: 'Chat Telegram',
      email: 'Suporte email',
      status: 'Status do serviço'
    },
    copyright: '© 2026 IndexFast. Todos os direitos reservados.',
    privacy: 'Privacidade',
    terms: 'Termos'
  },
  about: {
    eyebrow: 'Nossa equipe',
    title: 'Criamos ferramentas<br />para <em>indexação rápida</em>',
    lead: 'O IndexFast é uma equipe ucraniana que constrói ferramentas para indexação rápida no Google. Conheça nossa missão, valores e as pessoas por trás do produto.',
    mission: {
      label: 'Missão',
      title: 'Tornando o SEO transparente e eficaz',
      text: 'Acreditamos que cada site merece ser encontrado no Google. Nossa missão é simplificar o processo de indexação e tornar as ferramentas profissionais de SEO acessíveis para todos. O IndexFast foi criado para tornar o SEO mais transparente e eficaz. Usamos apenas métodos de indexação recomendados oficialmente pelo Google.'
    },
    values: [
      { icon: '⚡', title: 'Velocidade', desc: 'Otimizamos cada processo para entregar resultados em horas, não semanas.' },
      { icon: '🛡️', title: 'Segurança', desc: 'Apenas APIs oficiais do Google. Nenhum risco para seu site.' },
      { icon: '💎', title: 'Transparência', desc: 'Preços claros, logs detalhados, sem taxas ocultas.' }
    ],
    team: {
      label: 'Equipe',
      title: 'As pessoas por trás do IndexFast',
      sub: 'Uma pequena equipe com grandes ambições em SEO'
    },
    teamCards: [
      { name: 'Roman Matviy', role: 'Fundador & Desenvolvedor', bio: 'Desenvolvedor full-stack e entusiasta de SEO. Construiu o IndexFast para resolver problemas reais de indexação.' },
      { name: 'Andriy K.', role: 'Especialista SEO', bio: 'Especialista SEO com mais de 8 anos de experiência. Garante que o IndexFast siga as melhores práticas.' },
      { name: 'Maryna S.', role: 'Designer de Produto', bio: 'Cria interfaces intuitivas que tornam tarefas complexas de SEO simples para todos.' }
    ],
    ukraine: {
      title: 'Com orgulho ucraniano',
      text: 'IndexFast nasceu na Ucrânia. Estamos comprometidos em construir ferramentas de SEO de classe mundial enquanto apoiamos nossa comunidade e contribuímos para o ecossistema tecnológico.',
      badge: '⚡ Feito na Ucrânia'
    },
    cta: {
      title: 'Pronto para acelerar sua indexação?',
      subtitle: 'Junte-se a centenas de sites que já usam IndexFast',
      btnPrimary: 'Começar grátis →',
      btnSecondary: 'Contate-nos'
    }
  },
  contacts: {
    eyebrow: 'Estamos em contato',
    title: 'Contatos e <em>suporte</em>',
    lead: 'Tem perguntas? Escolha uma forma conveniente de nos contatar — responderemos o mais rápido possível.',
    cards: [
      { icon: '✈', title: 'Suporte Telegram', desc: 'Caminho mais rápido para obter uma resposta. Converse com a equipe.', link: 'Escreva no Telegram →' },
      { icon: '✉', title: 'Email', desc: 'Para consultas oficiais e propostas de parceria.', link: 'indexfastapp@gmail.com →' }
    ],
    seo: {
      title: 'Suporte profissional para seu SEO',
      text: 'Nossa equipe de suporte é composta por especialistas que entendem a API Google Indexing e SEO técnico.',
      items: [
        'Configuração do Google Cloud Console e contas de serviço.',
        'Resolução de erros \'Página não indexada\' no Search Console.',
        'Otimização de limites de API para grandes projetos e lojas online.',
        'Integração do IndexFast em seus fluxos de trabalho internos.'
      ]
    },
    info: [
      { title: 'Horário de trabalho', desc: 'Seg–Sex 9:00–19:00 (hora de Kiev). Plano Agency: suporte prioritário 24/7.' },
      { title: 'Parceria', desc: 'Estúdio SEO ou desenvolvedor? Programa de referência com pagamentos de até 20% por assinatura.' },
      { title: 'Responsabilidade', desc: 'Usamos apenas métodos de indexação recomendados oficialmente pelo Google.' }
    ]
  },
  faqsPage: {
    title: 'Perguntas frequentes',
    subtitle: 'Tudo o que você precisa saber sobre indexação no Google Search Console e IndexFast.',
    meta: {
      questions: '8 perguntas',
      updated: '2026'
    },
    cta: {
      title: 'Ainda tem perguntas?',
      text: 'Nossa equipe de suporte está pronta para ajudá-lo com qualquer dúvida sobre o IndexFast.',
      btn: 'Escreva-nos'
    }
  },
  affiliate: {
    badge: 'Programa de afiliados',
    title: 'Ganhe com <em>IndexFast</em>',
    subtitle: 'Recomende o IndexFast ao seu público e ganhe até 20% de comissão recorrente por assinatura.',
    ctaBtn: 'Torne-se um parceiro →',
    cards: [
      { icon: '💰', title: 'Até 20% de comissão', desc: 'Ganhe comissão recorrente por cada assinatura que você indicar. Quanto mais clientes você trouxer, mais ganha.' },
      { icon: '📊', title: 'Rastreamento em tempo real', desc: 'Acompanhe suas indicações, cliques e ganhos em tempo real através do nosso painel de parceiros.' },
      { icon: '🎯', title: 'Materiais de marketing', desc: 'Acesse banners, logotipos e conteúdo pronto para promover o IndexFast eficazmente.' }
    ]
  },
  status: {
    title: 'Todos os sistemas operacionais',
    subtitle: 'IndexFast está funcionando normalmente. Todos os serviços estão disponíveis.'
  },
  privacyPolicy: {
    title: 'Política de Privacidade',
    sections: [
      { title: 'Informações que coletamos', text: 'Coletamos informações que você nos fornece diretamente, por exemplo, ao criar uma conta, assinar nosso serviço ou entrar em contato com nosso suporte.' },
      { title: 'Como usamos suas informações', text: 'Usamos as informações coletadas para fornecer, manter e melhorar nossos serviços, processar transações e nos comunicar com você.' },
      { title: 'Segurança de dados', text: 'Implementamos medidas de segurança apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração ou divulgação.' },
      { title: 'Contate-nos', text: 'Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em indexfastapp@gmail.com.' }
    ]
  },
  terms: {
    title: 'Termos de Serviço',
    sections: [
      { title: 'Descrição do serviço', text: 'O IndexFast fornece serviços automatizados de indexação de sites usando a API do Google Indexing e o protocolo IndexNow.' },
      { title: 'Assinatura e faturamento', text: 'Oferecemos vários planos de assinatura. O pagamento é processado com segurança através dos nossos provedores de pagamento. As assinaturas são renovadas automaticamente, a menos que sejam canceladas.' },
      { title: 'Política de reembolso', text: 'Oferecemos um reembolso completo dentro de 14 dias após a compra, se você não estiver satisfeito com o nosso serviço.' },
      { title: 'Contate-nos', text: 'Se você tiver alguma dúvida sobre estes termos, entre em contato conosco em indexfastapp@gmail.com.' }
    ]
  },
  ltdPricing: {
    badge: '💰 Preços',
    title: 'Acesso vitalício<br /><em>a todos os recursos</em>',
    subtitle: 'Pagamento único, sem taxas recorrentes. Use para sempre!',
    cardBadge: 'Plano Vitalício',
    currency: '$',
    oldPrice: '250',
    newPrice: '120',
    cta: 'Começar',
    hurry: 'Vamos! Compre agora antes que o preço suba',
    whyTitle: 'Por que escolher o plano vitalício?',
    benefits: [
      { title: 'Unlimited access', desc: 'Unlimited access to all features available in the premium tiers without any monthly caps holding you back.' },
      { title: 'Free updates', desc: 'Free updates and new features. You will automatically receive all future improvements to the platform.' },
      { title: 'Premium support', desc: 'Premium support, always at your side. Get priority response from our dedicated support team.' },
      { title: 'One-time payment', desc: 'One-time payment, no surprises. Pay once and use the tool forever, completely eliminating subscription fatigue.' },
    ],
    comparisonHeaders: {
      type: 'Tipo de plano',
      monthly: 'Plano Mensal (Básico)',
      yearly: 'Plano Anual (Básico)',
    },
    comparisonTitle: 'Comparação de Planos',
    comparison: [
      { feature: 'Preço', basic: '$10/mês', yearly: '$96/ano', ltd: '$120 (era $250)' },
      { feature: 'Custo total (2 anos)', basic: '$240', yearly: '$192', ltd: '$120' },
      { feature: 'Acesso a recursos', basic: 'Todos', yearly: 'Todos', ltd: 'Todos' },
      { feature: 'Suporte prioritário', basic: '✗', yearly: '✗', ltd: '✓' },
    ],
    features: {
      item1: '3 sites',
      item2: 'Indexar até 200 páginas/dia',
      item3: 'Verificação de páginas novas/modificadas (diária)',
      item4: 'Indexação automática Google',
      item5: 'URLs ilimitados/site + suporte prioritário',
    },
    faqTitle: 'Como podemos ajudar?',
    faqs: [
      { q: 'O que acontece se eu usar apenas o Google Search Console?', a: 'Acesse o Google Search Console (search.google.com/search-console), adicione seu site, envie um sitemap, e o Google indexará eventualmente seu site.' },
      { q: 'Vocês precisam de acesso ao meu Search Console?', a: 'Sim. Solicitamos acesso ao seu Search Console para verificar alterações regularmente e indexar automaticamente as páginas.' },
      { q: 'Como verificar se meus URLs estão indexados?', a: 'Use os métodos seguintes para determinar se uma URL está indexada no Google.' },
      { q: 'Meus dados estão seguros?', a: 'A proteção de dados é nossa prioridade máxima. Protegemos seus dados conforme as normas GDPR e CCPA.' },
      { q: 'Qual é a política de reembolso?', a: 'Devido aos custos de configuração, não oferecemos reembolso. No entanto, você pode cancelar a qualquer momento.' },
      { q: 'Posso mudar meu plano mais tarde?', a: 'Você pode fazer upgrade/downgrade do seu plano a qualquer momento através de seu portal de faturamento.' },
    ],
    purchase: {
      title: 'Como comprar o plano vitalílio?',
      desc: 'Acesse o dashboard do IndexFast e compre o plano vitalílio na página de faturamento.',
      cta: 'Ver Planos',
      contact: 'Dúvidas? <a href="{link}" style="color: var(--green);">Fale conosco</a>',
    }
  }
};
