import { useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const ease = [0.76, 0, 0.24, 1] as const
const letters = 'EGNATIA'.split('')

function seenIntro() {
  try {
    return sessionStorage.getItem('egnatia-intro') === '1'
  } catch {
    return false
  }
}

/** How long the hero should wait so its entrance plays as the curtain lifts. */
export function useIntroDelay() {
  const reduce = useReducedMotion()
  const [delay] = useState(() => (reduce || seenIntro() ? 0 : 0.75))
  return delay
}

/** Brief branded curtain on first visit per session. */
export function Intro() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => !reduce && !seenIntro())
  const lenis = useLenis()

  // No scrolling underneath the curtain
  useEffect(() => {
    if (!lenis) return
    if (show) lenis.stop()
    else lenis.start()
  }, [show, lenis])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="on-dark fixed inset-0 z-[80] flex items-center justify-center bg-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="flex items-center gap-4">
            <motion.svg
              viewBox="0 0 32 32"
              className="size-12 text-accent"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <path d="M4 28V12L16 4l12 8v16h-7V18H11v10H4Z" fill="currentColor" />
            </motion.svg>
            <span className="flex overflow-hidden font-display text-5xl tracking-[0.12em]">
              {letters.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.03 }}
                  onAnimationComplete={
                    i === letters.length - 1
                      ? () =>
                          setTimeout(() => {
                            try {
                              sessionStorage.setItem('egnatia-intro', '1')
                            } catch {
                              /* storage unavailable */
                            }
                            setShow(false)
                          }, 80)
                      : undefined
                  }
                >
                  {l}
                </motion.span>
              ))}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
