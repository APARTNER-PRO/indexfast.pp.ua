export default {
  nav: {
    howItWorks: 'Cómo funciona',
    forWhom: 'Para quién',
    features: 'Ventajas',
    pricing: 'Precios',
    faq: 'FAQ',
    signIn: 'Iniciar sesión',
    getStarted: 'Comenzar gratis →',
    lang: 'ES ▾'
  },
  hero: {
    badge: '⚡ Google Indexing API & IndexNow',
    title: 'Tu sitio en Google y Bing',
    titleEm: 'en 24 horas',
    titleEnd: 'no en semanas',
    subtitle: 'Deja de esperar a que Google encuentre tus páginas. IndexFast las envía para indexación instantáneamente a través de la API oficial.',
    ctaPrimary: '🚀 Comenzar gratis',
    ctaSecondary: 'Cómo funciona ↓',
    stats: {
      indexed: 'URL indexadas',
      customers: 'Clientes satisfechos',
      avgTime: 'Tiempo promedio de indexación',
      freePerDay: 'URL gratis/día'
    }
  },
  problem: {
    tag: 'Problema',
    title: '¿Por qué Google ignora<br />tu sitio?',
    items: [
      { icon: '⏳', title: 'Googlebot rara vez rastrea', desc: 'Las páginas nuevas pueden esperar de 2 semanas a varios meses para ser indexadas — tus competidores te están superando' },
      { icon: '📉', title: 'El tráfico no crece', desc: 'Mientras las páginas no estén indexadas, son invisibles para los motores de búsqueda y no atraen clientes' },
      { icon: '🔧', title: 'Search Console es incómoda', desc: 'Enviar URLs manualmente una por una lleva horas y los errores de API asustan sin conocimientos técnicos.' }
    ],
    compareTitle: 'Tiempo hasta la indexación',
    without: '❌ Sin IndexFast',
    with: '✅ Con IndexFast',
    withoutTime: '2–8 semanas',
    withTime: '24–48 horas',
    speedupLabel: '14× más rápido',
    speedSub: 'aceleración promedio de indexación'
  },
  howItWorks: {
    tag: 'Cómo funciona',
    title: 'Tres pasos para la<br />indexación instantánea',
    subtitle: 'La configuración toma menos de 10 minutos. No se requieren conocimientos técnicos.',
    steps: [
      { num: '01', icon: '🔑', title: 'Conectar Search Console', desc: 'Descargue la clave JSON de su Google Service Account y agréguela a IndexFast. Una vez y para siempre.' },
      { num: '02', icon: '🗺️', title: 'Especificar la URL del sitemap', desc: 'Ingrese la dirección de su sitemap.xml o simplemente el dominio — IndexFast encontrará el sitemap automáticamente.' },
      { num: '03', icon: '⚡', title: 'Obtener el resultado', desc: 'Todas las páginas son enviadas para indexación. Obtenga un informe detallado y vea crecer su tráfico.' }
    ]
  },
  features: {
    tag: 'Ventajas',
    title: 'Todo lo que necesitas<br />para las primeras posiciones',
    subtitle: 'Hemos tomado la compleja Google Indexing API y la convertimos en una herramienta simple para cualquier negocio.',
    items: [
      { icon: '🗺️', title: 'Compatibilidad con Sitemap Index', desc: 'Analiza automáticamente sitemaps anidados de cualquier profundidad — todas las URLs serán encontradas y enviadas.' },
      { icon: '📊', title: 'Registro detallado', desc: 'Cada operación se registra en un archivo de registro con hora y estado. Siempre sabes qué sucedió y cuándo.' },
      { icon: '🛡️', title: 'Gestión de cuota', desc: 'Se adhiere automáticamente al límite de 200 URL/día de Google. Sin errores de exceso de cuota.' },
      { icon: '⚙️', title: 'Inicio flexible', desc: 'CLI, argumentos, modo interactivo. Ejecute manualmente, mediante cron o pipeline CI/CD.' },
      { icon: '🚀', title: 'API oficial de Google', desc: 'Utiliza la API oficial de Google Indexing — no esquemas grises, sino un método legal y confiable.' },
      { icon: '🔄', title: 'Automatización', desc: 'Configure un inicio automático mediante cron cada día — las nuevas páginas se indexarán solas.' }
    ]
  },
integrations: {
     label: 'Funciona con cualquier plataforma',
     footer: 'Si tu sitio tiene <strong>sitemap.xml</strong> — IndexFast funciona con él'
   },
   scroll: 'Desplazar',
   period: 'por mes',
  forWhom: {
    tag: 'Para quién',
    title: 'IndexFast funciona<br />para cualquier negocio',
    subtitle: 'Desde blogueros hasta agencias — si tienes un sitio web y quieres tráfico de Google, IndexFast es para ti.',
    items: [
      { emoji: '🛒', title: 'Tiendas online', desc: 'Cientos y miles de páginas de productos que Google no tiene tiempo de escanear. IndexFast garantiza que cada nuevo producto aparezca en la búsqueda lo más rápido posible.', tags: ['WooCommerce', 'OpenCart', 'Shopify', 'Prom.ua'] },
      { emoji: '✍️', title: 'Blogueros y medios', desc: '¿Publicas contenido todos los días? Los nuevos artículos aparecen en la búsqueda a la mañana siguiente, no semanas después. Tu contenido se posiciona primero mientras los competidores esperan.', tags: ['WordPress', 'Ghost', 'Portales de noticias'] },
      { emoji: '🏢', title: 'Sitios empresariales', desc: '¿Servicios actualizados, casos de estudio añadidos o precios cambiados? IndexFast señala instantáneamente a Google los cambios. Información actualizada en los resultados de búsqueda sin demora.', tags: ['Landings', 'Sitios corporativos'] },
      { emoji: '🏠', title: 'Inmobiliaria y clasificados', desc: 'Nuevos objetos aparecen todos los días. Los compradores buscan en Google ahora mismo — cada minuto de retraso en la indexación le cuesta un cliente.', tags: ['DOM.RIA', 'Agregadores', 'Tableros de avisos'] },
      { emoji: '🎯', title: 'Especialistas SEO y agencias', desc: '¿Gestionas múltiples proyectos? El plan Agency te permite gestionar hasta 50 sitios de clientes desde una cuenta y generar informes white-label.', tags: ['Multisitio', 'White-label', 'API'] },
      { emoji: '🚀', title: 'Startups y SaaS', desc: '¿Lanzando un nuevo producto? La indexación rápida de tu landing page y blog significa primeros usuarios orgánicos con cero gasto en anuncios — ya en la primera semana.', tags: ['Product Hunt', 'Landings', 'Blog'] }
    ]
  },
  testimonials: {
    tag: 'Reseñas de clientes',
    title: 'Ya están en la cima de Google',
    items: [
      { badge: '+340% tráfico orgánico', stars: '★★★★★', text: '"Lancé una tienda online — 800 productos, ninguno indexado durante semanas. Después de IndexFast en 2 días todas las páginas estaban en Google. El tráfico aumentó 4 veces en el primer mes."', name: 'Andriy Kovalenko', role: 'Propietario de tienda online, Kiev', initials: 'AK' },
      { badge: 'Indexación en 18 horas', stars: '★★★★★', text: '"Blogueo sobre viajes — publico 3-4 artículos por semana. Antes esperaba hasta 3 semanas para la indexación. Ahora el nuevo artículo está en circulación a la mañana siguiente. ¡Cambió las reglas del juego!"', name: 'Maryna Sydorenko', role: 'Bloguera, 50k seguidores', initials: 'MS' },
      { badge: 'Clientes de Google desde la 1ª semana', stars: '★★★★★', text: '"Lanzamos una landing page para un nuevo producto. Gracias a IndexFast, recibimos nuestros primeros clientes dentro de una semana. El SEO orgánico finalmente funciona como debería."', name: 'Dmytro Petrenko', role: 'CEO de un SaaS startup', initials: 'DP' },
      { badge: 'Ahorro de 8 horas/semana', stars: '★★★★★', text: '"Atiendo 15 sitios de clientes. Solía pasar horas enviando URLs manualmente a través de Search Console. Ahora un script maneja todos los clientes automáticamente cada día."', name: 'Oleg Morozenko', role: 'Especialista SEO, autónomo', initials: 'OHM' },
      { badge: 'Top 3 en 2 semanas', stars: '★★★★★', text: '"Bufete de abogados, nicho muy competitivo. Actualicé las páginas de servicios — IndexFast las envió instantáneamente. En 2 semanas estábamos en el top 3 para palabras clave. ¡Increíble!"', name: 'Natalia Zakharenko', role: 'Marketer de bufete de abogados', initials: 'NZ' },
      { badge: '200 → 2400 visitantes/día', stars: '★★★★★', text: '"Portal de noticias — publicamos 20+ materiales por día. IndexFast se inicia automáticamente en cron. El tráfico creció de 200 a 2.400 visitantes únicos por mes."', name: 'Vasyl Kravchenko', role: 'Editor jefe de medios', initials: 'VK' }
    ]
  },
  pricing: {
    tag: 'Precios',
    title: 'Precios justos,<br />sin comisiones ocultas',
    subtitle: 'Comienza gratis. Paga solo cuando veas resultados'
  },
  roi: {
    label: 'Calculadora',
    title: '¿Cuánto ahorras<br />con IndexFast?',
    subtitle: 'Personaliza la configuración para tu negocio — y verás un beneficio real en tiempo y dinero.',
    fields: {
      pages: 'Páginas en el sitio',
      newPages: 'Nuevas páginas por mes',
      rate: 'Tu tarifa ($/hora)',
      minsPer: 'Minutos para indexar manualmente 1 URL'
    },
    results: {
      timeLabel: 'Tiempo ahorrado en indexación',
      costLabel: 'Costo de este tiempo',
      speedLabel: 'Aceleración de la indexación',
      speedValue: 'hasta 14×',
      speedSub: 'de semanas a 24 horas',
      netBenefitLabel: 'Beneficio neto (ahorro - costo de PRO)',
      profitLabel: 'ganancia neta por mes',
      lossLabel: 'diferencia (considera PRO para volúmenes mayores)',
      actionLabel: 'Obtener beneficio →'
    }
  },
  faq: {
    tag: 'FAQ',
    title: 'Preguntas frecuentes',
    items: [
      { q: '¿Qué tan rápido indexará Google mis páginas?', a: 'Una vez enviadas a través de IndexFast, Google normalmente indexa las páginas en 24-48 horas. Es normal que un escaneo de Googlebot pueda tardar de 2 semanas a varios meses.' },
      { q: '¿Cuántas URLs puedo enviar gratis?', a: 'Google proporciona una cuota de 200 URL por día gratis a través de la Indexing API. El Plan Free de IndexFast gestiona automáticamente esta cuota. La cuota se puede ampliar en los tarifes Pro y Agency.' },
      { q: '¿Se requieren conocimientos técnicos?', a: 'Para el uso básico, solo necesitas conectar una cuenta de Google Search Console y especificar una URL sitemap.xml. Se incluyen instrucciones paso a paso. Para la automatización mediante cron, necesitarás conocimientos básicos de Linux.' },
      { q: '¿Es este el método oficial? ¿Google no prohibirá el sitio?', a: 'IndexFast utiliza solo la API oficial de Google Indexing. Este es el método recomendado por Google para la aceleración de la indexación. Sin riesgos para tu sitio.' },
      { q: '¿Qué pasa con otros motores de búsqueda (Bing, Naver)?', a: 'Sí, IndexFast también soporta completamente el protocolo IndexNow. Esto significa que tus enlaces se envían automáticamente no solo a Google, sino también a Bing, Naver, Seznam.cz y Yep simultáneamente.' },
      { q: '¿Qué pasa si mi sitio está en WordPress / Webflow / otra plataforma?', a: 'IndexFast funciona con cualquier sitio que tenga sitemap.xml — WordPress, Webflow, Wix, personalizado. Si tu sitio tiene sitemap — IndexFast funciona con él.' },
      { q: '¿Cómo configurar el inicio automático cada día?', a: 'Los tarifes Pro y Agency tienen un planificador incorporado. En el plan gratuito, puedes configurar una tarea cron en el servidor — instrucciones detalladas en la documentación.' },
      { q: '¿Hay reembolso?', a: 'Sí, ofrecemos una garantía de reembolso completo dentro de los 14 días posteriores al pago si el servicio no te convenció. Para consultas, escribe a indexfastapp@gmail.com.' }
    ]
  },
  blog: {
    tag: 'Materiales útiles',
    title: 'Lee nuestro blog',
    subtitle: 'Guías prácticas sobre SEO, indexación y promoción en Google',
    introText: 'Guías prácticas sobre SEO, indexación y promoción en Google',
    readMore: 'Todos los artículos →',
    readArticle: 'Leer artículo →',
    articles: [
      { href: '/blog/yak-pryskoriti-indeksaciyu-saitu-v-google', tag: 'Indexación', readTime: '10 minutos de lectura', title: 'Cómo acelerar la indexación de tu sitio en Google en 2025', desc: 'Guía paso a paso: desde la configuración del sitemap hasta la API de Google Indexing. Métodos reales que funcionan.' },
      { href: '/blog/shcho-take-sitemap-xml', tag: 'SEO', readTime: '7 minutos de lectura', title: 'Qué es sitemap.xml y por qué tu sitio lo necesita', desc: 'Análisis completo: estructura, tipos, errores y cómo configurar correctamente el sitemap para Google.' },
    ],
    ctaArticles: {
      title: 'Más artículos sobre SEO e indexación',
      desc: 'Guías prácticas, casos y consejos semanales'
    }
  },
  cta: {
    tag: 'Empieza ahora',
    title: 'Mientras lees—',
    titleEm: 'los competidores ya están en el top',
    subtitle: 'Únete a los 247+ sitios que ya obtienen clientes de Google con IndexFast.',
    trust: ['Gratis para siempre', 'Sin tarjeta de crédito', 'API oficial de Google']
  },
  footer: {
    brandDesc: 'Servicio para la indexación automática de páginas de sitios web en Google a través de la API oficial de Google Indexing.',
    product: {
      howItWorks: 'Cómo funciona',
      features: 'Ventajas',
      pricing: 'Tarifas',
      docs: 'Documentación'
    },
    company: {
      about: 'Sobre nosotros',
      blog: 'Blog',
      affiliate: 'Programa de afiliados',
      contacts: 'Contactos'
    },
    support: {
      faq: 'FAQ',
      telegram: 'Chat de Telegram',
      email: 'Soporte por email',
      status: 'Estado del servicio'
    },
    copyright: '© 2026 IndexFast. Todos los derechos reservados.',
    privacy: 'Privacidad',
    terms: 'Condiciones'
  },
  about: {
    eyebrow: 'Nuestro equipo',
    title: 'Creamos herramientas<br />para <em>indexación rápida</em>',
    lead: 'IndexFast es un equipo ucraniano que construye herramientas para la indexación rápida en Google. Conoce nuestra misión, valores y las personas detrás del producto.',
    mission: {
      label: 'Misión',
      title: 'Hacer el SEO transparente y efectivo',
      text: 'Creemos que cada sitio web merece ser encontrado en Google. Nuestra misión es simplificar el proceso de indexación y hacer que las herramientas profesionales de SEO sean accesibles para todos. IndexFast ha sido creado para hacer el SEO más transparente y efectivo. Utilizamos solo métodos de indexación recomendados oficialmente por Google.'
    },
    values: [
      { icon: '⚡', title: 'Velocidad', desc: 'Optimizamos cada proceso para entregar resultados en horas, no semanas.' },
      { icon: '🛡️', title: 'Seguridad', desc: 'Solo APIs oficiales de Google. Sin riesgos para tu sitio.' },
      { icon: '💎', title: 'Transparencia', desc: 'Precios claros, registros detallados, sin comisiones ocultas.' }
    ],
    team: {
      label: 'Equipo',
      title: 'Las personas detrás de IndexFast',
      sub: 'Un pequeño equipo con grandes ambiciones en SEO'
    },
    teamCards: [
      { name: 'Roman Matviy', role: 'Fundador y Desarrollador', bio: 'Desarrollador full-stack y entusiasta del SEO. Construyó IndexFast para resolver problemas reales de indexación.' },
      { name: 'Andriy K.', role: 'Especialista SEO', bio: 'Especialista SEO con más de 8 años de experiencia. Asegura que IndexFast siga las mejores prácticas.' },
      { name: 'Maryna S.', role: 'Diseñadora de Producto', bio: 'Crea interfaces intuitivas que hacen que las tareas complejas de SEO sean simples para todos.' }
    ],
    ukraine: {
      title: 'Con orgullo ucraniano',
      text: 'IndexFast nació en Ucrania. Estamos comprometidos a construir herramientas de SEO de clase mundial mientras apoyamos a nuestra comunidad y contribuimos al ecosistema tecnológico.',
      badge: '⚡ Hecho en Ucrania'
    },
    cta: {
      title: '¿Listo para acelerar tu indexación?',
      subtitle: 'Únete a cientos de sitios que ya usan IndexFast',
      btnPrimary: 'Comenzar gratis →',
      btnSecondary: 'Contáctanos'
    }
  },
  contacts: {
    eyebrow: 'Estamos en contacto',
    title: 'Contactos y <em>soporte</em>',
    lead: '¿Tienes preguntas? Elige una forma conveniente de contactarnos — responderemos lo antes posible.',
    cards: [
      { icon: '✈', title: 'Soporte Telegram', desc: 'La forma más rápida de obtener una respuesta. Chatea con el equipo.', link: 'Escribir a Telegram →' },
      { icon: '✉', title: 'Email', desc: 'Para consultas oficiales y propuestas de asociación.', link: 'indexfastapp@gmail.com →' }
    ],
    seo: {
      title: 'Soporte profesional para tu SEO',
      text: 'Nuestro equipo de soporte está formado por especialistas que entienden la Google Indexing API y el SEO técnico.',
      items: [
        'Configuración de Google Cloud Console y cuentas de servicio.',
        'Resolución de errores \'Página no indexada\' en Search Console.',
        'Optimización de límites de API para proyectos grandes y tiendas online.',
        'Integración de IndexFast en sus flujos de trabajo internos.'
      ]
    },
    info: [
      { title: 'Horario laboral', desc: 'Lun–Vie 9:00–19:00 (hora de Kiev). Plan Agency: soporte prioritario 24/7.' },
      { title: 'Asociación', desc: '¿Estudio SEO o desarrollador? Programa de referidos con pagos de hasta el 20% por suscripción.' },
      { title: 'Responsabilidad', desc: 'Utilizamos solo métodos de indexación recomendados oficialmente por Google.' }
    ]
  },
  faqsPage: {
    title: 'Preguntas frecuentes',
    subtitle: 'Todo lo que necesitas saber sobre la indexación en Google Search Console e IndexFast.',
    meta: {
      questions: '8 preguntas',
      updated: '2026'
    },
    cta: {
      title: '¿Todavía tienes preguntas?',
      text: 'Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta sobre IndexFast.',
      btn: 'Escríbenos'
    }
  },
  affiliate: {
    badge: 'Programa de afiliados',
    title: 'Gana con <em>IndexFast</em>',
    subtitle: 'Recomienda IndexFast a tu audiencia y gana hasta un 20% de comisión recurrente por cada suscripción.',
    ctaBtn: 'Conviértete en socio →',
    cards: [
      { icon: '💰', title: 'Hasta 20% de comisión', desc: 'Gana comisión recurrente por cada suscripción que recomiendes. Cuantos más clientes traigas, más ganas.' },
      { icon: '📊', title: 'Seguimiento en tiempo real', desc: 'Rastrea tus referidos, clics y ganancias en tiempo real a través de nuestro panel de socios.' },
      { icon: '🎯', title: 'Materiales de marketing', desc: 'Accede a banners, logotipos y contenido listo para promover IndexFast eficazmente.' }
    ]
  },
  status: {
    title: 'Todos los sistemas operativos',
    subtitle: 'IndexFast funciona con normalidad. Todos los servicios están disponibles.'
  },
  privacyPolicy: {
    title: 'Política de Privacidad',
    sections: [
      { title: 'Información que recopilamos', text: 'Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta, se suscribe a nuestro servicio o se comunica con nosotros para obtener soporte.' },
      { title: 'Cómo usamos su información', text: 'Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones y comunicarnos con usted.' },
      { title: 'Seguridad de datos', text: 'Implementamos medidas de seguridad apropiadas para proteger su información personal contra acceso no autorizado, alteración o divulgación.' },
      { title: 'Contáctenos', text: 'Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en indexfastapp@gmail.com.' }
    ]
  },
  terms: {
    title: 'Términos de Servicio',
    sections: [
      { title: 'Descripción del servicio', text: 'IndexFast proporciona servicios automatizados de indexación de sitios web utilizando la API de Google Indexing y el protocolo IndexNow.' },
      { title: 'Suscripción y facturación', text: 'Ofrecemos varios planes de suscripción. El pago se procesa de forma segura a través de nuestros proveedores de pago. Las suscripciones se renuevan automáticamente a menos que se cancelen.' },
      { title: 'Política de reembolso', text: 'Ofrecemos un reembolso completo dentro de los 14 días posteriores a la compra si no está satisfecho con nuestro servicio.' },
      { title: 'Contáctenos', text: 'Si tiene alguna pregunta sobre estos términos, contáctenos en indexfastapp@gmail.com.' }
    ]
  },
  ltdPricing: {
    badge: '💰 Precios',
    title: 'Acceso de por vida<br /><em>a todas las funciones</em>',
    subtitle: 'Pago único, sin cargos recurrentes. ¡Úsalo para siempre!',
    cardBadge: 'Tarifa de por vida',
    currency: '$',
    oldPrice: '250',
    newPrice: '120',
    cta: 'Comenzar',
    hurry: '¡Apresúrate!!! Compra ahora antes de que suba el precio',
    whyTitle: '¿Por qué elegir la tarifa de por vida?',
    benefits: [
      { title: 'Unlimited access', desc: 'Unlimited access to all features available in the premium tiers without any monthly caps holding you back.' },
      { title: 'Free updates', desc: 'Free updates and new features. You will automatically receive all future improvements to the platform.' },
      { title: 'Premium support', desc: 'Premium support, always at your side. Get priority response from our dedicated support team.' },
      { title: 'One-time payment', desc: 'One-time payment, no surprises. Pay once and use the tool forever, completely eliminating subscription fatigue.' },
    ],
    comparisonHeaders: {
      type: 'Tipo de tarifa',
      monthly: 'Tarifa Mensual (Básico)',
      yearly: 'Tarifa Anual (Básico)',
    },
    comparisonTitle: 'Comparación de tarifas',
    comparison: [
      { feature: 'Precio', basic: '$10/mes', yearly: '$96/año', ltd: '$120 (era $250)' },
      { feature: 'Costo total (2 años)', basic: '$240', yearly: '$192', ltd: '$120' },
      { feature: 'Acceso a funciones', basic: 'Todas', yearly: 'Todas', ltd: 'Todas' },
      { feature: 'Soporte prioritario', basic: '✗', yearly: '✗', ltd: '✓' },
    ],
    features: {
      item1: '3 sitios web',
      item2: 'Indexar hasta 200 páginas/día',
      item3: 'Verificación de páginas nuevas/modificadas (diaria)',
      item4: 'Indexación automática de Google',
      item5: 'URLs ilimitadas/sitio web + soporte prioritario',
    },
    faqTitle: '¿En qué podemos ayudarle?',
    faqs: [
      { q: '¿Qué pasa si solo uso Google Search Console?', a: 'Ve a Google Search Console (search.google.com/search-console), agrega tu sitio, envía un sitemap, y Google indexará eventualmente tu sitio.' },
      { q: '¿Necesitan acceso a mi Search Console?', a: 'Sí. Solicitamos acceso a tu Search Console para verificar cambios y hacer la indexación automáticamente.' },
      { q: '¿Cómo verificar si mis URLs están indexadas?', a: 'Utiliza los métodos siguientes para determinar si una URL está indexada en Google.' },
      { q: '¿Están seguros mis datos?', a: 'La protección de datos es nuestra máxima prioridad. Protegemos tus datos según los estándares GDPR y CCPA.' },
      { q: '¿Cuál es la política de reembolso?', a: 'Debido a los costos de configuración, no ofrecemos reembolsos. Puedes cancelar en cualquier momento.' },
      { q: '¿Puedo cambiar mi plan más tarde?', a: 'Puedes actualizar/reducir tu plan cuando quieras desde tu portal de facturación.' },
    ],
    purchase: {
      title: '¿Cómo comprar la tarifa de por vida?',
      desc: 'Ve al dashboard de IndexFast y compra la tarifa de por vida en la página de facturación.',
      cta: 'Ver tarifas',
      contact: '¿Dudas? <a href="{link}" style="color: var(--green);">Contáctanos</a>',
    }
  }
};
