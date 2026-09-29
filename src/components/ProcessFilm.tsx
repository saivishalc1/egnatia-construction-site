import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { rich, useLang } from '@/i18n'
import { canAutoplayVideo, isSmallScreen } from '@/lib/media'
import { useLowPower } from '@/lib/perf-mode'
import { publicUrl } from '@/lib/utils'

/**
 * "How we build": a pinned, full-screen film that plays forward and backward with
 * the scrollbar while the four process steps hand off as captions. The clip is
 * encoded with a keyframe every 6 frames so seeking stays smooth (see public/videos).
 */
export function ProcessFilm() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [enabled] = useState(canAutoplayVideo)
  const [src] = useState(() => (publicUrl(isSmallScreen() ? 'videos/approach-720.mp4' : 'videos/approach-1280.mp4')))
  // Touch devices play the clip instead of scrubbing it: constant seeking is heavy for phone decoders
  const [canScrub] = useState(() => !window.matchMedia('(pointer: coarse)').matches)
  // Low-power devices also play instead of scrub (section height stays put either way)
  const low = useLowPower()
  const scrub = canScrub && !low
  const target = useRef(0)
  const current = useRef(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const steps = t.process.steps

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    target.current = p
  })

  // Ease the playhead toward the scroll position each frame so scrubbing feels fluid
  // Start downloading ~1.5 screens before the section arrives, not on page load
  useEffect(() => {
    if (!enabled) return
    const video = videoRef.current
    if (!video) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        video.preload = 'auto'
        video.load()
        // iOS Safari only allows seeking after the video has been started once
        if (canScrub) video.play().then(() => video.pause()).catch(() => {})
        io.disconnect()
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [enabled, canScrub])

  // Phones: play while on screen, pause when not
  useEffect(() => {
    if (!enabled || scrub) return
    const video = videoRef.current
    if (!video) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    io.observe(video)
    return () => io.disconnect()
  }, [enabled, scrub])

  useEffect(() => {
    if (!enabled || !scrub) return
    const video = videoRef.current
    if (!video) return
    let raf = 0
    let running = false
    const tick = () => {
      const duration = video.duration
      if (duration) {
        current.current += (target.current - current.current) * 0.2
        const time = current.current * (duration - 0.05)
        // One seek at a time: queuing seeks faster than the decoder can serve them is what stutters
        if (!video.seeking && Math.abs(video.currentTime - time) > 1 / 30) video.currentTime = time
      }
      if (running) raf = requestAnimationFrame(tick)
    }

    // Only run the loop while the section is on screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true
        raf = requestAnimationFrame(tick)
      } else if (!entry.isIntersecting) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    if (sectionRef.current) io.observe(sectionRef.current)


    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [enabled, scrub])

  // Reduced motion / data saver: the same story as a still, readable list
  if (!enabled) {
    return (
      <section id="process" className="on-dark relative overflow-hidden bg-ink py-28" aria-label={t.process.eyebrow}>
        <img src={publicUrl('videos/approach-poster.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="container-x relative">
          <p className="eyebrow mb-6 text-bone/80">{t.process.eyebrow}</p>
          <h2 className="text-[clamp(2.75rem,6vw,5.5rem)]">{rich(t.process.lines.join(' '))}</h2>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={i}>
                <StepCopy index={i} count={steps.length} label={t.process.step} title={s.title} body={s.body} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section
      id="process"
      ref={sectionRef}
      className={`on-dark relative bg-ink ${canScrub ? 'h-[460svh]' : 'h-[320svh]'}`}
      aria-label={t.process.eyebrow}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          poster={publicUrl('videos/approach-poster.jpg')}
          muted
          playsInline
          loop={!scrub}
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,10,9,.85)_0%,rgba(11,10,9,.35)_55%,rgba(11,10,9,.2)_100%),linear-gradient(0deg,rgba(11,10,9,.85)_0%,transparent_50%)]"
        />

        <div className="container-x relative flex h-full flex-col justify-between pt-28 pb-14 sm:pb-20">
          <div>
            <p className="eyebrow mb-5 text-bone/80">{t.process.eyebrow}</p>
            <h2 className="max-w-xl text-[clamp(2.25rem,4.5vw,4rem)]">{rich(t.process.lines.join(' '))}</h2>
          </div>

          <div>
            <div className="relative min-h-[17rem] sm:min-h-[15rem]">
              {steps.map((s, i) => (
                <Caption key={`${t.locale}-${i}`} index={i} count={steps.length} progress={scrollYProgress}>
                  <StepCopy index={i} count={steps.length} label={t.process.step} title={s.title} body={s.body} />
                </Caption>
              ))}
            </div>
            <div className="mt-10 flex items-center gap-3" aria-hidden>
              {steps.map((_, i) => (
                <Tick key={i} index={i} count={steps.length} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Each caption owns an equal slice of the scroll and cross-fades with its neighbours. */
function Caption({
  index,
  count,
  progress,
  children,
}: {
  index: number
  count: number
  progress: MotionValue<number>
  children: React.ReactNode
}) {
  const start = index / count
  const end = (index + 1) / count
  const fade = 0.035
  // Function transforms (rather than keyframe arrays) keep this on the main thread;
  // the hardware-accelerated path mis-handled these ranges and left captions stuck.
  // 0 = fully shown; negative = still to come; positive = already passed.
  const phase = (p: number) => {
    if (index > 0 && p < start + fade) return Math.max(-1, (p - (start + fade)) / (2 * fade))
    if (index < count - 1 && p > end - fade) return Math.min(1, (p - (end - fade)) / (2 * fade))
    return 0
  }
  const opacity = useTransform(progress, (p) => 1 - Math.abs(phase(p)))
  const y = useTransform(progress, (p) => phase(p) * -40)

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 max-w-3xl">
      {children}
    </motion.div>
  )
}

function Tick({ index, count, progress }: { index: number; count: number; progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [index / count, (index + 1) / count], [0, 1])
  return (
    <span className="h-0.5 w-16 overflow-hidden rounded-full bg-bone/20 sm:w-24">
      <motion.span className="block h-full origin-left bg-accent" style={{ scaleX }} />
    </span>
  )
}

function StepCopy({ index, count, label, title, body }: { index: number; count: number; label: string; title: string; body: string }) {
  return (
    <>
      <p className="text-[0.7rem] tracking-[0.28em] text-accent uppercase">
        {label} {index + 1} / {count}
      </p>
      <h3 className="mt-4 text-[clamp(2.6rem,6vw,5.75rem)] leading-[0.95]">{title}</h3>
      <p className="mt-5 max-w-md text-base text-bone/75 sm:text-lg">{body}</p>
    </>
  )
}
