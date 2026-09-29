// Spanish translation. Keep the same shape as en.ts; TypeScript flags any missing key.
// Written in neutral Latin American Spanish; have a native speaker review before launch.

import type { Content } from './en'

export const es: Content = {
  locale: 'es-US',
  meta: {
    title: 'Egnatia Construction | Contratista general en Brooklyn, NY',
    description:
      'Egnatia Construction Inc. es un contratista general con licencia en Brooklyn para remodelaciones completas, brownstones, ampliaciones y casas a medida en toda la ciudad de Nueva York. Proyectos desde $150K.',
  },

  nav: {
    links: ['Servicios', 'Proyectos', 'Proceso', 'Presupuesto', 'Estudio'],
    start: 'Iniciar un proyecto',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    skip: 'Saltar al contenido',
    home: 'Egnatia Construction, volver al inicio',
    language: 'Idioma',
    main: 'Principal',
  },
  logoSub: 'Construction',

  hero: {
    eyebrow: 'Contratista general · Brooklyn, NY',
    lines: ['Hecho en', 'Brooklyn.', '*Hecho para durar.*'],
    body: 'Remodelaciones completas, brownstones y casas a medida en toda la ciudad de Nueva York, de principio a fin con un solo equipo con licencia. Proyectos desde $150K.',
    ctaPrimary: 'Calcula tu proyecto',
    ctaSecondary: 'Ver proyectos',
    scroll: 'Desliza',
    imageAlt: 'Casa moderna de dos pisos con revestimiento de madera, iluminada al atardecer',
    highlights: ['Años construyendo en NYC', 'Proyecto mínimo', 'Oficios en cada obra', 'Inglés y español'],
    highlightWords: ['Licencia', 'Bilingüe'],
    pauseVideo: 'Pausar el video de fondo',
    playVideo: 'Reproducir el video de fondo',
  },

  trades: {
    label: 'Oficios',
    items: [
      'Remodelaciones completas',
      'Brownstones',
      'Cocinas y baños',
      'Ampliaciones',
      'Sótanos',
      'Mampostería y fachadas',
      'Casas a medida',
    ],
  },

  manifesto: {
    eyebrow: 'Nuestro enfoque',
    statement:
      'No hacemos trabajos pequeños. Nos dedicamos a remodelaciones serias, brownstones y casas nuevas, y le damos a cada una la atención que un hogar merece.',
    emphasis: ['serias', 'atención'],
  },


  services: {
    eyebrow: 'Lo que construimos',
    lines: ['Todos los oficios,', 'un solo *equipo.*'],
    body: 'Sin coordinar cinco subcontratistas. Desde el primer presupuesto hasta la entrega final, un solo equipo dirige todo tu proyecto, por dentro y por fuera.',
    items: [
      {
        title: 'Remodelación completa',
        body: 'Remodelaciones totales que replantean la distribución, las instalaciones y los acabados, habitación por habitación, en una sola obra coordinada.',
      },
      {
        title: 'Brownstones y townhouses',
        body: 'Restauramos la estructura de las casas históricas (escalinatas, fachadas, mampostería) y renovamos el interior para la vida moderna.',
      },
      {
        title: 'Cocinas y baños',
        body: 'Los espacios más importantes, renovados como parte de una remodelación mayor, con gabinetes y azulejos bien hechos.',
      },
      {
        title: 'Ampliaciones',
        body: 'Extensiones traseras, pisos adicionales y nueva estructura, con ingeniería y permisos, integradas limpiamente a la casa existente.',
      },
      {
        title: 'Sótanos habitables',
        body: 'Recalce, impermeabilización y acabado completo para convertir el nivel más bajo en un espacio para vivir.',
      },
      {
        title: 'Casas a medida',
        body: 'Construcción desde cero, gestionada de principio a fin, desde los cimientos hasta la última capa de pintura.',
      },
    ],
  },

  work: {
    eyebrow: 'Proyectos seleccionados',
    lines: ['Espacios a los que da *gusto*', 'volver.'],
    body: 'Desliza para ver cocinas, baños, remodelaciones y obras nuevas recientes. Toca un proyecto para abrirlo.',
    open: 'Abrir proyecto',
    close: 'Cerrar proyecto',
    similar: 'Empezar un proyecto similar',
    items: [
      { title: 'Sala abierta', type: 'Remodelación completa' },
      { title: 'Salón cálido y moderno', type: 'Remodelación total' },
      { title: 'Residencia de madera y vidrio', type: 'Casa a medida' },
      { title: 'Cocina blanca', type: 'Remodelación de cocina' },
      { title: 'Baño estilo spa', type: 'Suite principal' },
      { title: 'Luz de atardecer', type: 'Casa a medida' },
    ],
  },

  transformation: {
    eyebrow: 'La transformación',
    lines: ['Desliza para ver', 'la *diferencia.*'],
    body: 'Distribuciones cansadas, acabados anticuados, espacio desperdiciado. Llevamos cada espacio a lo esencial y lo reconstruimos para que se sienta luminoso, abierto y nuevo.',
    caption: 'Arrastra el control, o selecciónalo y usa las flechas del teclado.',
    before: 'Antes',
    after: 'Después',
    afterAlt: 'Sala abierta y luminosa después de la remodelación',
    beforeAlt: 'La misma sala en blanco y negro',
    sliderLabel: 'Comparar antes y después',
  },

  estimator: {
    eyebrow: 'Calculadora de costos',
    lines: ['¿Cuánto costará', 'tu *proyecto?*'],
    intro: (minimum: string) =>
      `Obtén un estimado en menos de un minuto. Aceptamos proyectos desde ${minimum}, así que también sabrás rápidamente si somos la opción adecuada.`,
    projectLegend: '1. ¿Qué vas a construir?',
    projects: {
      'whole-home': { label: 'Remodelación completa', blurb: 'Renovar por completo una casa o apartamento' },
      brownstone: { label: 'Brownstone / townhouse', blurb: 'Remodelación total de una casa histórica' },
      'kitchen-bath': { label: 'Cocinas y baños', blurb: 'Cocina y uno o más baños' },
      addition: { label: 'Ampliación', blurb: 'Extensión trasera o piso adicional' },
      basement: { label: 'Sótano', blurb: 'Convertir el nivel inferior en espacio habitable' },
      'custom-home': { label: 'Casa nueva a medida', blurb: 'Construcción desde cero' },
    },
    sizeLabel: '2. Tamaño aproximado',
    sqft: 'pies²',
    sqftLong: 'pies cuadrados',
    finishLegend: '3. Nivel de acabados',
    finishes: {
      standard: { label: 'Estándar', blurb: 'Calidad, durabilidad, bien construido' },
      premium: { label: 'Premium', blurb: 'Carpintería a medida, piedra, accesorios superiores' },
      luxury: { label: 'Lujo', blurb: 'Todo a medida, materiales de primer nivel' },
    },
    addOnsLegend: '4. ¿Algo más?',
    optional: '(opcional)',
    addOns: {
      structural: { label: 'Cambios estructurales', detail: 'Mover paredes, vigas nuevas' },
      systems: { label: 'Nueva climatización, electricidad y plomería', detail: 'Reemplazo total de instalaciones' },
      permits: { label: 'Arquitecto y permisos del DOB', detail: 'Planos y trámites en NYC' },
      exterior: { label: 'Fachada, techo o mampostería', detail: 'Restauración exterior' },
      outdoor: { label: 'Terraza o jardín', detail: 'Espacio exterior' },
    },
    resultLabel: 'Inversión estimada',
    minimumMarker: 'Mínimo $150K',
    status: {
      fit: {
        title: 'Encaja perfecto.',
        body: 'Este es exactamente el tipo de proyecto que construimos. Envíanoslo y coordinamos un presupuesto gratuito en tu propiedad.',
      },
      borderline: {
        title: 'Justo en nuestro mínimo.',
        body: 'Según los detalles, podría funcionar. Envíanoslo y lo conversamos.',
      },
      below: {
        title: 'Por debajo de nuestro mínimo de $150K.',
        body: 'Para proyectos de este tamaño es mejor un especialista. Agregar espacios o mejorar los acabados suele poner el proyecto dentro del rango.',
      },
    },
    rows: {
      base: 'Construcción base',
      finish: 'Mejora de acabados',
      addOns: 'Adicionales',
      timeline: 'Duración típica',
    },
    included: 'Incluido',
    none: 'Ninguno',
    timelines: ['3–5 meses', '5–9 meses', '9–14 meses', '12–20 meses'],
    send: 'Enviar este estimado a Egnatia',
    adjust: 'Ajusta el alcance arriba',
    disclaimer:
      'Un estimado basado en costos típicos de la ciudad de Nueva York, no una cotización. El número real sale de un presupuesto gratuito en tu propiedad.',
    seeEstimate: 'Ver estimado',
    live: (low: string, high: string, below: boolean) =>
      `Estimado entre ${low} y ${high}.${below ? ' Está por debajo del mínimo de $150,000 por proyecto.' : ''}`,
  },

  process: {
    eyebrow: 'Cómo trabajamos',
    lines: ['Sin sorpresas.', 'Solo *avances.*'],
    imageAlt: 'Contratista revisando planos arquitectónicos en un escritorio',
    step: 'Paso',
    sceneLabel: 'Una casa en 3D se arma mientras te desplazas: líneas del plano, luego la estructura, luego paredes y techo, y al final las luces encendidas.',
    scroll: 'Desliza para construir',
    steps: [
      {
        title: 'Consulta y presupuesto gratis',
        body: 'Recorremos la propiedad contigo, hablamos de tus metas y presupuesto, y te damos un presupuesto claro por escrito sin costo.',
      },
      {
        title: 'Planos y permisos',
        body: 'Planos, materiales, calendario y permisos de NYC, todo resuelto antes de derribar la primera pared.',
      },
      {
        title: 'Construcción',
        body: 'Oficios con licencia en la obra, un sitio limpio todos los días y una sola persona de contacto que contesta el teléfono.',
      },
      {
        title: 'Entrega final',
        body: 'Revisamos juntos cada espacio y no lo damos por terminado hasta que tú lo digas.',
      },
    ],
  },

  about: {
    eyebrow: 'Sobre Egnatia',
    lines: ['Un constructor de Brooklyn', 'que sí *contesta*', 'el teléfono.'],
    body: 'Egnatia Construction Inc. lleva más de una década construyendo y remodelando casas en toda la ciudad de Nueva York. Lo mantenemos simple: precios justos, oficios con licencia, una obra limpia y un trabajo del que estamos orgullosos.',
    badge: 'años construyendo en NYC',
    imageAlt: 'Equipo de construcción con equipo de seguridad trabajando en una obra',
    values: [
      { title: 'Respuestas claras', body: 'Presupuestos por escrito y plazos honestos antes de empezar cualquier trabajo.' },
      { title: 'Oficios con licencia', body: 'Profesionales calificados y con licencia en cada parte de la obra.' },
      { title: 'Respuesta rápida', body: 'Llamas y hablas con alguien que conoce tu proyecto.' },
      { title: 'Hablamos español', body: 'Trabajamos contigo en inglés o en español, como prefieras.' },
    ],
  },

  reviews: {
    eyebrow: 'Reseñas de clientes',
    lines: ['Lo que dicen', 'nuestros *clientes.*'],
    basedOn: (n: number) => `Según ${n} reseñas en Google`,
    stars: (r: string) => `${r} de 5 estrellas`,
    leave: 'Dejar una reseña',
    readAll: 'Todas las reseñas en Google',
    from: 'Reseñas de Google',
    more: 'Leer la reseña completa',
    heroBadge: (r: string, n: number) => `${r} en Google · ${n} reseñas`,
  },

  faq: {
    eyebrow: 'Preguntas',
    lines: ['Bueno saberlo', 'antes de *empezar.*'],
    items: [
      {
        q: '¿Por qué tienen un mínimo de $150,000?',
        a: 'Nos enfocamos en remodelaciones importantes y obras nuevas para que cada proyecto reciba a todo nuestro equipo, una persona de contacto dedicada y la atención al detalle que estas casas merecen. Para trabajos más pequeños es mejor un especialista.',
      },
      {
        q: '¿Qué tan preciso es el estimado en línea?',
        a: 'Es un cálculo aproximado basado en costos típicos de la ciudad de Nueva York, para saber si tus planes y tu presupuesto están en el mismo rango. El número real sale de un presupuesto gratuito en tu propiedad, una vez que veamos el lugar y tus planos.',
      },
      {
        q: '¿Se encargan de los permisos y del arquitecto?',
        a: 'Sí. Coordinamos planos, ingeniería y los trámites ante el Departamento de Edificios de NYC como parte del proyecto, o trabajamos junto a tu arquitecto si ya tienes uno.',
      },
      {
        q: '¿Trabajan en condominios y cooperativas?',
        a: 'Sí. Estamos acostumbrados a aprobaciones de la junta, acuerdos de alteración, certificados de seguro y horarios de trabajo del edificio, y planificamos el calendario en función de ellos.',
      },
      {
        q: '¿Cuánto dura una remodelación?',
        a: 'La mayoría de las remodelaciones completas duran varios meses; las ampliaciones y las casas nuevas toman más tiempo. Recibirás un calendario por escrito con el presupuesto y te mantenemos informado durante toda la obra.',
      },
      {
        q: '¿Atienden en español?',
        a: 'Sí. Trabajamos con nuestros clientes en inglés o en español, como prefieran. Puedes cambiar el idioma de este sitio en la parte superior de la página.',
      },
    ],
  },

  contact: {
    eyebrow: 'Empieza tu proyecto',
    lines: ['Construyamos', 'algo *grande.*'],
    intro: (minimum: string) =>
      `Cuéntanos sobre tu proyecto y coordinamos un presupuesto gratuito y sin compromiso en tu propiedad. Aceptamos proyectos desde ${minimum}.`,
    serving: 'Brooklyn, NY · Atendemos toda la ciudad de Nueva York',
    estimateAttached: 'Estimado adjunto:',
    fields: {
      name: 'Nombre completo',
      phone: 'Teléfono',
      email: 'Correo electrónico',
      type: 'Tipo de proyecto',
      typePlaceholder: 'Elige uno',
      budget: 'Presupuesto',
      budgetPlaceholder: 'Elige un rango',
      message: 'Cuéntanos sobre el proyecto',
      messageHint: 'Opcional: espacios, tamaño aproximado, plazos, presupuesto.',
    },
    somethingElse: 'Otro',
    budgets: ['$150K – $300K', '$300K – $600K', '$600K – $1M', '$1M+', 'Aún no lo sé'],
    submit: 'Solicitar mi presupuesto gratis',
    errors: {
      name: 'Por favor, dinos tu nombre.',
      reach: 'Agrega un teléfono o correo para poder contactarte.',
      phone: 'Ingresa un teléfono de 10 dígitos.',
      email: 'Ingresa un correo electrónico válido.',
    },
    thanksTitle: 'Gracias, lo recibimos.',
    thanksBody: 'Te contactaremos en un día hábil para coordinar tu presupuesto gratuito.',
    estimateMessage: (e) =>
      `Desde la calculadora en línea: ${e.project.toLowerCase()}, unos ${e.sqft} pies², acabados ${e.finish.toLowerCase()}${
        e.addOns.length ? `, además de ${e.addOns.join(', ').toLowerCase()}` : ''
      }. Estimado ${e.range}.`,
  },

  footer: {
    blurb: (minimum: string) =>
      `Remodelaciones completas, brownstones y casas a medida en toda la ciudad de Nueva York. Proyectos desde ${minimum}.`,
    nav: 'Pie de página',
    about: 'Preguntas',
    backToTop: 'Volver arriba ↑',
  },

  mobileCta: { call: 'Llamar', estimate: 'Estimar' },
}
