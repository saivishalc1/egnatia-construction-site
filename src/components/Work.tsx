import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useLenis } from 'lenis/react'
import { useLowPower } from '@/lib/perf-mode'
import { scrollTimelineSupported as sd } from '@/lib/scroll-timeline'
import { projectImages } from '@/data'
import { StockImage } from './ui/stock-image'
import { rich, useLang } from '@/i18n'
import { MaskLines, Reveal } from './Reveal'
import { ProjectDialog } from './ProjectDialog'
import { withViewTransition } from '@/lib/view-transition'
import { flushSync } from 'react-dom'

/** Pinned section that scrolls the project cards sideways as you scroll down. */
export function Work() {
  const { t } = useLang()
  const projects = t.work.items.map((p, i) => ({ ...p, image: projectImages[i] }))
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const reduceMotion = useReducedMotion()

  // Project detail view. `morph` is the card that carries the shared
  // view-transition-name, so only that one photo morphs.
  const [open, setOpen] = useState<number | null>(null)
  const [morph, setMorph] = useState<number | null>(null)
  const cardButtons = useRef<(HTMLButtonElement | null)[]>([])
  const openProject = (i: number) => {
    flushSync(() => setMorph(i))
    withViewTransition(() => setOpen(i))
  }
  const closeProject = useCallback(
    (then?: () => void) => {
      const i = open
      withViewTransition(() => setOpen(null))
      requestAnimationFrame(() => {
        if (then) then()
        else if (i !== null) cardButtons.current[i]?.focus({ preventScroll: true })
      })
    },
    [open],
  )
  const cardProps = (i: number) => ({
    onOpen: () => openProject(i),
    buttonRef: (el: HTMLButtonElement | null) => {
      cardButtons.current[i] = el
    },
    vtName: morph === i && open !== i ? `project-${i}` : undefined,
    openLabel: t.work.open,
  })
  const dialog =
    open !== null ? <ProjectDialog project={projects[open]} index={open} onClose={closeProject} /> : null

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const progress = scrollYProgress

  // Cards lean into fast scrolling, then spring upright
  const skewTarget = useMotionValue(0)
  const skew = useSpring(skewTarget, { stiffness: 180, damping: 22 })
  const low = useLowPower()
  useLenis((l) => skewTarget.set(low ? 0 : Math.max(-6, Math.min(6, -l.velocity * 0.3))))
  useAnimationFrame(() => {
    const s = skewTarget.get()
    if (s !== 0) skewTarget.set(Math.abs(s) < 0.01 ? 0 : s * 0.9)
  })

  if (reduceMotion) {
    return (
      <section id="work" className="on-light bg-ink py-24 sm:py-32">
        <WorkHeading />
        <div className="container-x mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={i} {...p} {...cardProps(i)} className="w-full" />
          ))}
        </div>
        {dialog}
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="work"
      className={`on-light relative bg-ink ${sd ? 'sd-work' : ''}`}
      style={{ height: `calc(100svh + ${distance}px)`, '--work-distance': `${distance}px` } as React.CSSProperties}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-24 pb-10">
        <WorkHeading />
        <motion.div
          ref={trackRef}
          style={sd ? undefined : { x }}
          className={`mt-10 flex w-max gap-5 pr-5 pl-5 sm:pl-8 lg:mt-14 lg:pl-12 ${sd ? 'sd-work-track' : ''}`}
        >
          {projects.map((p, i) => (
            <ProjectCard key={i} {...p} {...cardProps(i)} index={i} skew={skew} className="w-[78vw] sm:w-[52vw] lg:w-[min(34vw,calc((100svh-22rem)*4/3))]" />
          ))}
        </motion.div>
        <div className="container-x mt-8">
          <div className="h-px w-full bg-line">
            <motion.div
              className={`h-px origin-left bg-accent ${sd ? 'sd-work-progress' : ''}`}
              style={sd ? undefined : { scaleX: progress }}
            />
          </div>
        </div>
      </div>
      {dialog}
    </section>
  )
}

function WorkHeading() {
  const { t } = useLang()
  return (
    <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <Reveal>
          <p className="eyebrow mb-6">{t.work.eyebrow}</p>
        </Reveal>
        <h2 className="text-[clamp(2.5rem,5vw,4.75rem)]">
          <MaskLines lines={t.work.lines.map(rich)} />
        </h2>
      </div>
      <Reveal delay={0.1}>
        <p className="max-w-xs text-stone">{t.work.body}</p>
      </Reveal>
    </div>
  )
}

function ProjectCard({
  title,
  type,
  image,
  index,
  skew,
  className,
  onOpen,
  buttonRef,
  vtName,
  openLabel,
}: {
  title: string
  type: string
  image: string
  index?: number
  skew?: MotionValue<number>
  className?: string
  onOpen: () => void
  buttonRef: (el: HTMLButtonElement | null) => void
  vtName?: string
  openLabel: string
}) {
  return (
    <motion.figure style={{ skewX: skew }} className={`group shrink-0 ${className ?? ''}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-label={`${openLabel}: ${title}`}
        className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl bg-surface"
        style={{ viewTransitionName: vtName }}
      >
        <StockImage
          id={image}
          sizes="(min-width: 1024px) 34vw, (min-width: 640px) 52vw, 78vw"
          alt={`${title}, ${type.toLowerCase()}`}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
      </button>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <span className="font-display text-xl font-medium">{title}</span>
        <span className="text-sm text-stone">
          {index !== undefined && <span className="mr-3 text-accent tabular-nums">{String(index + 1).padStart(2, '0')}</span>}
          {type}
        </span>
      </figcaption>
    </motion.figure>
  )
}
