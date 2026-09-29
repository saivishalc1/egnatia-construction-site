import { lazy, startTransition, Suspense, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { Nav } from './components/Nav'
import { ScrollGovernor } from './components/ScrollGovernor'
import { useLang } from './i18n'

// Start fetching the rest of the page immediately, in parallel with rendering the hero
const belowFold = import('./components/BelowFold')
const BelowFold = lazy(() => belowFold.then((m) => ({ default: m.BelowFold })))
const PageEnd = lazy(() => belowFold.then((m) => ({ default: m.PageEnd })))
const PalettePicker = import.meta.env.DEV
  ? lazy(() => import('./components/PalettePicker').then((m) => ({ default: m.PalettePicker })))
  : null

export default function App() {
  const { t } = useLang()
  const [showRest, setShowRest] = useState(false)

  // Let the hero paint and start animating first, then render the rest of the page
  // as an interruptible transition so it never blocks those first frames.
  useEffect(() => {
    const go = () => startTransition(() => setShowRest(true))
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(go, { timeout: 1200 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(go, 300)
    return () => clearTimeout(id)
  }, [])

  return (
    // "user" honours the visitor's reduce-motion setting across every animation
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-ink"
      >
        {t.nav.skip}
      </a>
      <ScrollGovernor />
      <div aria-hidden className="film-grain" />
      <Intro />
      <Nav />
      <main id="main">
        <Hero />
        {showRest ? (
          <Suspense fallback={<div className="min-h-svh" />}>
            <BelowFold />
          </Suspense>
        ) : (
          <div className="min-h-svh" />
        )}
      </main>
      {showRest && (
        <Suspense>
          <PageEnd />
        </Suspense>
      )}
      {PalettePicker && (
        <Suspense>
          <PalettePicker />
        </Suspense>
      )}
    </MotionConfig>
  )
}
