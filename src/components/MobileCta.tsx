import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Calculator, Phone } from 'lucide-react'
import { company } from '@/data'
import { useLang } from '@/i18n'

/** Thumb-reach call / estimate bar on phones once the hero is scrolled past. */
export function MobileCta() {
  const { t } = useLang()
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  const inEstimator = useRef(false)

  useEffect(() => {
    // Sections with their own full-screen UI: the estimator's price bar, the 3D story
    const els = ['estimate', 'process'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const inside = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inside.add(e.target)
        else inside.delete(e.target)
      }
      inEstimator.current = inside.size > 0
    })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const nearBottom = y + window.innerHeight > document.documentElement.scrollHeight - 700
    // The estimator has its own pinned price bar, so step aside there
    setVisible(y > window.innerHeight * 0.9 && !nearBottom && !inEstimator.current)
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '120%' }}
          animate={{ y: 0 }}
          exit={{ y: '120%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-2 gap-2 rounded-full border border-line bg-ink/95 p-1.5 shadow-lg lg:hidden"
        >
          <a href={company.phones[0].href} className="btn-ghost min-h-11 border-transparent">
            <Phone className="size-4" aria-hidden /> {t.mobileCta.call}
          </a>
          <a href="#estimate" className="btn-primary min-h-11">
            <Calculator className="size-4" aria-hidden /> {t.mobileCta.estimate}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
