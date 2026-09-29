// Non-translatable data: contact details, images, numbers and estimator rates.
// All visible text lives in src/content/en.ts and src/content/es.ts.
// Photos are Unsplash placeholders; swap them for Egnatia's own project photos before launch.

export const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const MINIMUM_PROJECT = 150_000

export const company = {
  legalName: 'Egnatia Construction Inc.',
  email: 'info@egnatiaconstruction.com',
  phones: [
    { display: '(718) 581-3386', href: 'tel:+17185813386' },
    { display: '(212) 392-5544', href: 'tel:+12123925544' },
  ],
}

/** Section anchors, in the same order as `nav.links` in the content files. */
export const navHrefs = ['#services', '#work', '#process', '#estimate', '#about']

export const images = {
  hero: '1600585154340-be6161a56a0c',
  blueprint: '1503387762-592deb58ef4e',
}

/** One image per service, in the same order as `services.items`. */
export const serviceImages = [
  '1600607687939-ce8a6c25118c',
  '1762216454185-4bca7b059d09',
  '1484154218962-a197022b5858',
  '1600566753190-17f0baa2a6c3',
  '1581858726788-75bc0f6a952d',
  '1600585154340-be6161a56a0c',
]

/** One image per project, in the same order as `work.items`. */
export const projectImages = [
  '1600607687939-ce8a6c25118c',
  '1600210492486-724fe5c67fb0',
  '1600566753190-17f0baa2a6c3',
  '1484154218962-a197022b5858',
  '1620626011761-996317b8d101',
  '1600585154340-be6161a56a0c',
]

export const highlightNumbers = [
  { value: 10, suffix: '+' },
  { value: 150, prefix: '$', suffix: 'K+' },
  null,
  null,
]

/* ─── Cost estimator ─────────────────────────────────────────────
   Ballpark NYC rates per square foot at the "Standard" finish level.
   These are starting assumptions: confirm every number with Egnatia before launch. */

export type EstimatorProject = {
  id: string
  rate: number
  sqft: { min: number; max: number; step: number; default: number }
}

export const estimatorProjects: EstimatorProject[] = [
  { id: 'whole-home', rate: 300, sqft: { min: 600, max: 6000, step: 50, default: 1800 } },
  { id: 'brownstone', rate: 375, sqft: { min: 1200, max: 7000, step: 50, default: 3000 } },
  { id: 'kitchen-bath', rate: 550, sqft: { min: 100, max: 1200, step: 10, default: 400 } },
  { id: 'addition', rate: 450, sqft: { min: 150, max: 2500, step: 25, default: 600 } },
  { id: 'basement', rate: 225, sqft: { min: 300, max: 2500, step: 25, default: 900 } },
  { id: 'custom-home', rate: 425, sqft: { min: 1500, max: 8000, step: 100, default: 3000 } },
]

export const finishLevels = [
  { id: 'standard', multiplier: 1 },
  { id: 'premium', multiplier: 1.3 },
  { id: 'luxury', multiplier: 1.7 },
] as const

export const estimatorAddOns = [
  { id: 'structural', percent: 0.1 },
  { id: 'systems', percent: 0.12 },
  { id: 'permits', percent: 0.08 },
  { id: 'exterior', fixed: 35_000 },
  { id: 'outdoor', fixed: 40_000 },
] as const

/** Lower bounds of the contact form's budget ranges (last option is "not sure"). */
export const budgetFloors = [150_000, 300_000, 600_000, 1_000_000]

/** srcset across common widths so phones never download desktop-sized photos. */
export const unsplashSrcSet = (id: string, extra = '', widths = [480, 800, 1200, 1600, 2000]) =>
  widths.map((w) => `${unsplash(id, w)}${extra} ${w}w`).join(', ')
