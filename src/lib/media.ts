/** Skip autoplaying video for reduced-motion users and data-saver connections. */
export function canAutoplayVideo() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return !connection?.saveData
}

/** Phones get the lighter encodes. */
export const isSmallScreen = () => window.matchMedia('(max-width: 768px)').matches
