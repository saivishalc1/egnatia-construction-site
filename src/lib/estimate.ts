import { estimatorAddOns, estimatorProjects, finishLevels, MINIMUM_PROJECT } from '@/data'

export type EstimateInput = {
  projectId: string
  sqft: number
  finishId: (typeof finishLevels)[number]['id']
  addOns: string[]
}

export type EstimateResult = {
  base: number
  finishExtra: number
  addOnTotal: number
  mid: number
  low: number
  high: number
  /** Index into the content file's `estimator.timelines`. */
  timelineIndex: number
  status: 'below' | 'borderline' | 'fit'
}

const roundTo = (n: number, step = 5000) => Math.round(n / step) * step

export function calculateEstimate(input: EstimateInput): EstimateResult {
  const project = estimatorProjects.find((p) => p.id === input.projectId) ?? estimatorProjects[0]
  const finish = finishLevels.find((f) => f.id === input.finishId) ?? finishLevels[0]

  const base = project.rate * input.sqft
  const finished = base * finish.multiplier
  const addOnTotal = estimatorAddOns
    .filter((a) => input.addOns.includes(a.id))
    .reduce((sum, a) => sum + ('percent' in a ? finished * a.percent : a.fixed), 0)

  const mid = finished + addOnTotal
  const low = roundTo(mid * 0.9)
  const high = roundTo(mid * 1.15)
  const timelineIndex = mid < 300_000 ? 0 : mid < 700_000 ? 1 : mid < 1_500_000 ? 2 : 3
  const status = high < MINIMUM_PROJECT ? 'below' : low < MINIMUM_PROJECT ? 'borderline' : 'fit'

  return { base, finishExtra: finished - base, addOnTotal, mid, low, high, timelineIndex, status }
}

/** What the estimator hands to the contact form. Stores ids so labels follow the language. */
export type SentEstimate = EstimateInput & { id: number; low: number; high: number }

export const formatUsd = (n: number, locale: string) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export const formatUsdCompact = (n: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(n)
