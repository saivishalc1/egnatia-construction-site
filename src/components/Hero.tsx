import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useScroll, useTransform } from 'motion/react'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { highlightNumbers } from '@/data'
import { rich, useLang } from '@/i18n'
import { HeroVideo } from './HeroVideo'
import { scrollTimelineSupported as sd } from '@/lib/scroll-timeline'
import { useGoogleReviews } from '@/lib/reviews'
import { Stars } from './ui/stars'
import { useIntroDelay } from './Intro'
import { Magnetic } from './Magnetic'
import { MaskLines } from './Reveal'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.25])
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const d = useIntroDelay()
  const reviews = useGoogleReviews()
  const ratingText = reviews?.rating?.toLocaleString(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <section ref={ref} id="top" className="on-dark relative flex h-svh min-h-[620px] flex-col overflow-hidden bg-ink">
      <motion.div
        className={`absolute inset-0 ${sd ? 'sd-hero-media' : ''}`}
        style={sd ? undefined : { scale: imageScale, y: imageY }}
      >
        <HeroVideo />
      </motion.div>
      {/* Cinematic grade: darker left edge for the type, heavy floor for the stats */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,10,9,.82)_0%,rgba(11,10,9,.35)_55%,rgba(11,10,9,.25)_100%),linear-gradient(0deg,rgba(11,10,9,.9)_0%,rgba(11,10,9,0)_55%),linear-gradient(180deg,rgba(11,10,9,.55)_0%,transparent_22%)]"
      />

      <motion.div
        style={sd ? undefined : { y: contentY, opacity: contentOpacity }}
        className={`container-x relative flex flex-1 flex-col justify-end pt-32 pb-12 sm:pb-16 ${sd ? 'sd-hero-content' : ''}`}
      >
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <motion.p
              className="eyebrow mb-7 text-bone/75"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: d + 0.05 }}
            >
              {t.hero.eyebrow}
            </motion.p>

            <h1 className="max-w-[13ch] text-[clamp(3.4rem,9vw,8.75rem)] leading-[0.92]">
              <MaskLines key={t.locale} animateOnMount delay={d + 0.1} lines={t.hero.lines.map(rich)} />
            </h1>

            <motion.p
              className="mt-8 max-w-md text-base text-bone/80 sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: d + 0.4 }}
            >
              {t.hero.body}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: d + 0.5 }}
            >
              <Magnetic>
                <a href="#estimate" className="btn-primary group w-full sm:w-auto">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#work" className="btn-ghost w-full sm:w-auto">
                  {t.hero.ctaSecondary} <ArrowDownRight className="size-4" aria-hidden />
                </a>
              </Magnetic>
            </motion.div>

            {reviews && ratingText && (
              <motion.a
                href="#reviews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: d + 0.7 }}
                className="mt-7 inline-flex items-center gap-3 text-sm text-bone/80 transition-colors hover:text-bone"
              >
                <Stars rating={reviews.rating!} label={t.reviews.stars(ratingText)} className="text-base" />
                {t.reviews.heroBadge(ratingText, reviews.count)}
              </motion.a>
            )}
          </div>

          {/* Two quiet figures, bottom right */}
          <dl className="hidden gap-9 text-right lg:grid">
            {highlightNumbers.slice(0, 2).map((n, i) =>
              n ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease, delay: d + 0.6 + i * 0.1 }}
                >
                  <dd className="font-display text-5xl leading-none">
                    <CountUp to={n.value} prefix={n.prefix} suffix={n.suffix} delay={d + 0.7} />
                  </dd>
                  <dt className="mt-2 text-[0.68rem] tracking-[0.24em] text-bone/60 uppercase">{t.hero.highlights[i]}</dt>
                </motion.div>
              ) : null,
            )}
          </dl>
        </div>
      </motion.div>

      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: d + 1 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[0.65rem] tracking-[0.35em] text-bone/45 uppercase sm:block"
      >
        {t.hero.scroll}
      </motion.span>
    </section>
  )
}

/** Rolls a stat up from zero once the intro has finished. */
function CountUp({ to, prefix = '', suffix = '', delay }: { to: number; prefix?: string; suffix?: string; delay: number }) {
  const value = useMotionValue(0)
  const text = useTransform(value, (v) => `${prefix}${Math.round(v)}${suffix}`)
  useEffect(() => {
    const controls = animate(value, to, { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [to, delay, value])
  return <motion.span className="lining-nums tabular-nums">{text}</motion.span>
}
