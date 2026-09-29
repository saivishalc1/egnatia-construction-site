import { flushSync } from 'react-dom'

/**
 * Runs a React state update inside the View Transitions API so the browser
 * morphs between before/after (elements sharing a view-transition-name animate
 * from one position/size to the other). Falls back to an instant update when the
 * API is missing or the visitor prefers reduced motion.
 */
export function withViewTransition(update: () => void) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) {
    update()
    return
  }
  document.startViewTransition(() => flushSync(update))
}
