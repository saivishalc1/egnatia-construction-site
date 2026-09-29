import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { serviceImages, unsplash } from '@/data'
import { rich, useLang } from '@/i18n'
import { StockImage } from './ui/stock-image'
import { MaskLines, Reveal } from './Reveal'

/**
 * Services as an editorial index: large serif rows. On desktop a photo follows the
 * cursor and swaps as you move between rows; on phones each row carries its photo.
 */
export function Services() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const listRef = useRef<HTMLUListElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 })

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !listRef.current) return
    const r = listRef.current.getBoundingClientRect()
    x.set(e.clientX - r.left)
    y.set(e.clientY - r.top)
  }

  return (
    <section id="services" className="on-light relative bg-ink py-28 sm:py-40">
      <div className="container-x">
        <div className="mb-16 grid gap-8 lg:mb-24 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">{t.services.eyebrow}</p>
            </Reveal>
            <h2 className="text-[clamp(3rem,7vw,6.75rem)]">
              <MaskLines lines={t.services.lines.map(rich)} />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-md text-lg text-stone lg:ml-auto">{t.services.body}</p>
          </Reveal>
        </div>

        <ul
          ref={listRef}
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(null)}
          className="relative border-t border-line"
        >
          {t.services.items.map((s, i) => (
            <li key={i} onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(i)} className="border-b border-line">
              <a
                href="#estimate"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-3 py-7 sm:gap-x-8 sm:py-9 lg:grid-cols-[4rem_1.2fr_1fr_auto]"
              >
                <span className="self-start pt-2 text-xs tracking-[0.2em] text-stone tabular-nums lg:self-center lg:pt-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[clamp(1.9rem,4vw,3.6rem)] leading-none transition-[color,translate] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-accent">
                  {s.title}
                </span>
                <span className="col-start-2 max-w-md text-sm text-stone lg:col-start-3 lg:text-base">{s.body}</span>
                <span className="col-start-3 row-start-1 flex size-11 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent lg:col-start-4">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
                {/* Phones and tablets: the photo sits in the row */}
                <span className="col-span-3 mt-2 block aspect-[16/9] overflow-hidden rounded-xl lg:hidden">
                  <StockImage id={serviceImages[i]} sizes="92vw" alt="" className="h-full w-full object-cover" />
                </span>
              </a>
            </li>
          ))}

          {/* Desktop: cursor-following preview */}
          {!reduce && (
            <motion.div
              aria-hidden
              style={{ x: sx, y: sy }}
              className="pointer-events-none absolute top-0 left-0 z-10 hidden lg:block"
            >
              <AnimatePresence>
                {hovered !== null && (
                  <motion.div
                    key={hovered}
                    initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute -top-44 left-10 h-72 w-56 overflow-hidden rounded-xl shadow-2xl"
                  >
                    <img src={unsplash(serviceImages[hovered], 600)} alt="" className="h-full w-full object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </ul>
      </div>
    </section>
  )
}
