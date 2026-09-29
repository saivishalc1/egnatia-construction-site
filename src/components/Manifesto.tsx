import { useRef } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import { useLang } from '@/i18n'

/**
 * Big statement whose words light up one by one as you scroll through it.
 * One CSS variable (--p) is written per frame; each word derives its own opacity
 * in CSS, instead of running one scroll subscription per word.
 */
export function Manifesto() {
  const { t } = useLang()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = t.manifesto.statement.split(' ')
  const emphasis = new Set(t.manifesto.emphasis)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    ref.current?.style.setProperty('--p', String(p * words.length))
  })

  return (
    <section className="py-28 sm:py-40" aria-label={t.manifesto.eyebrow}>
      <div className="container-x">
        <p className="eyebrow mb-10">{t.manifesto.eyebrow}</p>
        <p
          ref={ref}
          style={{ '--p': 0 } as React.CSSProperties}
          className="max-w-[22ch] font-display text-[clamp(2rem,5.2vw,5rem)] leading-[1.05] font-medium tracking-[-0.03em]"
        >
          <span className="sr-only">{t.manifesto.statement}</span>
          <span aria-hidden>
            {words.map((word, i) => (
              <span
                key={`${t.locale}-${i}`}
                style={{ '--i': i } as React.CSSProperties}
                className="inline-block pr-[0.25em] opacity-[clamp(0.14,calc(var(--p)-var(--i)),1)]"
              >
                {emphasis.has(word.replace(/[^\p{L}]/gu, '')) ? (
                  <span className="font-serif font-medium tracking-normal text-accent italic">{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  )
}
