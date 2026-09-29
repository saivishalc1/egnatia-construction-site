// All on-page text lives here and in es.ts. Wrap a word in *asterisks* to render it
// as the italic accent in headings. Numbers, rates and images live in src/data.ts.

type EstimateSummary = {
  project: string
  sqft: string
  finish: string
  addOns: string[]
  range: string
}

export const en = {
  locale: 'en-US',
  meta: {
    title: 'Egnatia Construction | General Contractor in Brooklyn, NY',
    description:
      'Egnatia Construction Inc. is a licensed Brooklyn general contractor for whole-home renovations, brownstones, additions and custom homes across New York City. Projects from $150K.',
  },

  nav: {
    links: ['Services', 'Work', 'Process', 'Estimate', 'Studio'],
    start: 'Start a project',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skip: 'Skip to content',
    home: 'Egnatia Construction, back to top',
    language: 'Language',
    main: 'Main',
  },
  logoSub: 'Construction',

  hero: {
    eyebrow: 'General contractor · Brooklyn, NY',
    lines: ['Built in', 'Brooklyn.', '*Built to last.*'],
    body: 'Whole-home renovations, brownstones and custom homes across New York City, built start to finish by one licensed team. Projects from $150K.',
    ctaPrimary: 'Estimate your project',
    ctaSecondary: 'See our work',
    scroll: 'Scroll',
    imageAlt: 'Modern two-storey home with timber cladding, lit up at dusk',
    highlights: ['Years building in NYC', 'Project minimum', 'Trades on every job', 'Se habla español'],
    highlightWords: ['Licensed', 'Español'],
    pauseVideo: 'Pause background video',
    playVideo: 'Play background video',
  },

  trades: {
    label: 'Trades',
    items: [
      'Whole-home renovations',
      'Brownstones',
      'Kitchens & baths',
      'Additions',
      'Cellar conversions',
      'Masonry & façades',
      'Custom homes',
    ],
  },

  manifesto: {
    eyebrow: 'Our approach',
    statement:
      'We don’t do small jobs. We take on serious renovations, brownstones and new homes, and give every one of them the attention a house deserves.',
    emphasis: ['serious', 'attention'],
  },


  services: {
    eyebrow: 'What we build',
    lines: ['Every trade,', 'one *crew.*'],
    body: 'No juggling five subcontractors. From the first estimate to the final walkthrough, one team runs your whole project, inside and out.',
    items: [
      {
        title: 'Whole-Home Renovation',
        body: 'Gut renovations that rethink layout, systems and finishes, room by room, in one coordinated build.',
      },
      {
        title: 'Brownstones & Townhouses',
        body: 'Restoring the bones of historic row houses (stoops, façades, masonry) while rebuilding the inside for modern life.',
      },
      {
        title: 'Kitchens & Baths',
        body: 'The rooms that matter most, rebuilt as part of a larger renovation, with cabinetry and tile done properly.',
      },
      {
        title: 'Additions & Extensions',
        body: 'Rear extensions, added floors and new structure, engineered, permitted and tied cleanly into the existing home.',
      },
      {
        title: 'Basement & Cellar Conversions',
        body: 'Underpinning, waterproofing and full fit-out that turns the lowest level into real living space.',
      },
      {
        title: 'Custom Homes',
        body: 'Ground-up builds managed end to end, from foundations to the final coat of paint.',
      },
    ],
  },

  work: {
    eyebrow: 'Selected work',
    lines: ['Spaces people *love*', 'coming home to.'],
    body: 'Scroll to browse recent kitchens, baths, renovations and new builds. Tap any project to open it.',
    open: 'Open project',
    close: 'Close project',
    similar: 'Start a similar project',
    items: [
      { title: 'Open-plan living', type: 'Whole-home renovation' },
      { title: 'Warm modern lounge', type: 'Full remodel' },
      { title: 'Timber & glass residence', type: 'Custom home' },
      { title: 'Crisp white kitchen', type: 'Kitchen renovation' },
      { title: 'Spa-style bath', type: 'Primary suite' },
      { title: 'Evening glow', type: 'Custom home' },
    ],
  },

  transformation: {
    eyebrow: 'The transformation',
    lines: ['Drag to see', 'the *difference.*'],
    body: 'Tired layouts, dated finishes, wasted space. We take rooms down to what matters and rebuild them to feel bright, open and new.',
    caption: 'Drag the handle, or focus it and use the arrow keys.',
    before: 'Before',
    after: 'After',
    afterAlt: 'Bright open-plan living room after renovation',
    beforeAlt: 'The same living room shown desaturated',
    sliderLabel: 'Compare before and after',
  },

  estimator: {
    eyebrow: 'Cost estimator',
    lines: ['What will your', 'project *cost?*'],
    intro: (minimum: string) =>
      `Get a ballpark in under a minute. We take on projects from ${minimum}, so this also tells you quickly whether we’re the right fit.`,
    projectLegend: '1. What are you building?',
    projects: {
      'whole-home': { label: 'Whole-home renovation', blurb: 'Gut and rebuild an entire house or apartment' },
      brownstone: { label: 'Brownstone / townhouse', blurb: 'Full renovation of a historic row house' },
      'kitchen-bath': { label: 'Kitchens & baths', blurb: 'Kitchen plus one or more bathrooms' },
      addition: { label: 'Addition / extension', blurb: 'New rear extension or added floor' },
      basement: { label: 'Basement / cellar', blurb: 'Convert the lowest level to living space' },
      'custom-home': { label: 'New custom home', blurb: 'Ground-up construction' },
    } as Record<string, { label: string; blurb: string }>,
    sizeLabel: '2. Approximate size',
    sqft: 'sq ft',
    sqftLong: 'square feet',
    finishLegend: '3. Level of finish',
    finishes: {
      standard: { label: 'Standard', blurb: 'Quality, durable, well-built' },
      premium: { label: 'Premium', blurb: 'Custom millwork, stone, upgraded fixtures' },
      luxury: { label: 'Luxury', blurb: 'Bespoke everything, top-tier materials' },
    } as Record<string, { label: string; blurb: string }>,
    addOnsLegend: '4. Anything else?',
    optional: '(optional)',
    addOns: {
      structural: { label: 'Structural changes', detail: 'Moving walls, new beams' },
      systems: { label: 'New HVAC, electrical & plumbing', detail: 'Full systems replacement' },
      permits: { label: 'Architect & DOB permits', detail: 'Drawings and NYC filings' },
      exterior: { label: 'Façade, roofing or masonry', detail: 'Exterior restoration' },
      outdoor: { label: 'Deck or garden', detail: 'Outdoor living space' },
    } as Record<string, { label: string; detail: string }>,
    resultLabel: 'Estimated investment',
    minimumMarker: '$150K minimum',
    status: {
      fit: {
        title: 'A great fit.',
        body: 'This is exactly the kind of project we build. Send it over and we’ll set up a free on-site estimate.',
      },
      borderline: {
        title: 'Right around our minimum.',
        body: 'Depending on the details this could work. Send it over and we’ll talk it through.',
      },
      below: {
        title: 'Below our $150K minimum.',
        body: 'Projects this size are better served by a specialist trade. Adding rooms or upgrading finishes often brings a scope into range.',
      },
    },
    rows: {
      base: 'Base construction',
      finish: 'Finish upgrades',
      addOns: 'Add-ons',
      timeline: 'Typical timeline',
    },
    included: 'Included',
    none: 'None',
    timelines: ['3–5 months', '5–9 months', '9–14 months', '12–20 months'],
    send: 'Send this estimate to Egnatia',
    adjust: 'Adjust the scope above',
    disclaimer:
      'A ballpark based on typical New York City costs, not a quote. Your real number comes from a free on-site estimate.',
    seeEstimate: 'See estimate',
    live: (low: string, high: string, below: boolean) =>
      `Estimated between ${low} and ${high}.${below ? ' This is below the $150,000 project minimum.' : ''}`,
  },

  process: {
    eyebrow: 'How it works',
    lines: ['No surprises.', 'Just *progress.*'],
    imageAlt: 'Contractor reviewing architectural drawings at a desk',
    step: 'Step',
    sceneLabel: 'A 3D house assembles as you scroll: blueprint lines, then the frame, then walls and roof, then lights on.',
    scroll: 'Scroll to build',
    steps: [
      {
        title: 'Consult & free estimate',
        body: 'We walk the property with you, talk through goals and budget, and give you a clear written estimate at no cost.',
      },
      {
        title: 'Plan & permits',
        body: 'Drawings, materials, schedule and NYC permits, all settled before the first wall comes down.',
      },
      {
        title: 'Build',
        body: 'Licensed trades on site, a clean job every day, and one point of contact who answers the phone.',
      },
      {
        title: 'Final walkthrough',
        body: 'We go room by room together and don’t call it finished until you do.',
      },
    ],
  },

  about: {
    eyebrow: 'About Egnatia',
    lines: ['A Brooklyn builder', 'who *answers*', 'the phone.'],
    body: 'Egnatia Construction Inc. has spent more than a decade building and renovating homes across New York City. We keep it simple: fair pricing, licensed trades, a clean job site, and work we are proud to put our name on.',
    badge: 'years building across NYC',
    imageAlt: 'Construction crew in safety gear working on a building site',
    values: [
      { title: 'Straight answers', body: 'Clear written estimates and honest timelines, before any work starts.' },
      { title: 'Licensed trades', body: 'Qualified, licensed professionals on every part of the job.' },
      { title: 'Quick response', body: 'Call and you reach someone who knows your project.' },
      { title: 'Se habla español', body: 'We work with you in English or Spanish, whichever you prefer.' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    lines: ['Good to know', 'before we *start.*'],
    items: [
      {
        q: 'Why do you have a $150,000 minimum?',
        a: 'We focus on substantial renovations and new builds so every project gets our full team, a dedicated point of contact and the attention to detail these homes deserve. Smaller jobs are better served by a specialist trade.',
      },
      {
        q: 'How accurate is the online estimate?',
        a: 'It’s a ballpark based on typical New York City costs, meant to tell you whether your plans and budget are in the same range. Your real number comes from a free on-site estimate once we’ve seen the property and your plans.',
      },
      {
        q: 'Do you handle permits and architects?',
        a: 'Yes. We coordinate drawings, engineering and NYC Department of Buildings filings as part of the project, or work alongside your own architect if you already have one.',
      },
      {
        q: 'Do you work in condos and co-ops?',
        a: 'Yes. We’re used to board approvals, alteration agreements, insurance certificates and building work-hour rules, and we plan the schedule around them.',
      },
      {
        q: 'How long does a renovation take?',
        a: 'Most whole-home renovations run several months; additions and new homes take longer. You’ll get a written schedule with the estimate, and we keep you updated as the work progresses.',
      },
      {
        q: 'Do you work with Spanish-speaking clients?',
        a: 'Yes. We work with clients in English or Spanish, whichever you prefer. You can switch this website to Spanish at the top of the page.',
      },
    ],
  },

  contact: {
    eyebrow: 'Start your project',
    lines: ['Let’s build', 'something *great.*'],
    intro: (minimum: string) =>
      `Tell us about your project and we’ll set up a free, no-pressure estimate at your property. We take on projects from ${minimum}.`,
    serving: 'Brooklyn, NY · Serving all of New York City',
    estimateAttached: 'Estimate attached:',
    fields: {
      name: 'Full name',
      phone: 'Phone',
      email: 'Email',
      type: 'Project type',
      typePlaceholder: 'Choose one',
      budget: 'Budget',
      budgetPlaceholder: 'Choose a range',
      message: 'Tell us about the project',
      messageHint: 'Optional: rooms, rough size, timeline, budget.',
    },
    somethingElse: 'Something else',
    budgets: ['$150K – $300K', '$300K – $600K', '$600K – $1M', '$1M+', 'Not sure yet'],
    submit: 'Request my free estimate',
    errors: {
      name: 'Please tell us your name.',
      reach: 'Add a phone number or email so we can reach you.',
      phone: 'Enter a 10-digit phone number.',
      email: 'Enter a valid email address.',
    },
    thanksTitle: 'Thanks, we’ve got it.',
    thanksBody: 'We’ll be in touch within one business day to schedule your free estimate.',
    estimateMessage: (e: EstimateSummary) =>
      `From the online estimator: ${e.project.toLowerCase()}, about ${e.sqft} sq ft, ${e.finish.toLowerCase()} finishes${
        e.addOns.length ? `, plus ${e.addOns.join(', ').toLowerCase()}` : ''
      }. Ballpark ${e.range}.`,
  },

  footer: {
    blurb: (minimum: string) =>
      `Whole-home renovations, brownstones and custom homes across New York City. Projects from ${minimum}.`,
    nav: 'Footer',
    about: 'FAQ',
    backToTop: 'Back to top ↑',
  },

  mobileCta: { call: 'Call', estimate: 'Estimate' },
}

export type Content = typeof en
export type { EstimateSummary }
