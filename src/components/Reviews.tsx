import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { rich, useLang } from '@/i18n'
import { useGoogleReviews } from '@/lib/reviews'
import { Stars } from './ui/stars'
import { MaskLines, Reveal } from './Reveal'

const MAX_CHARS = 300

/**
 * Real Google rating and reviews (Places API, refreshed on each build and daily).
 * Shows the true overall rating and the reviews Google returns, unfiltered, with
 * attribution. Renders nothing until data exists.
 */
export function Reviews() {
  const { t } = useLang()
  const data = useGoogleReviews()
  if (!data || !data.rating) return null
  const c = t.reviews
  const rating = data.rating.toLocaleString(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <section id="reviews" className="on-light bg-ink py-28 sm:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow mb-6">{c.eyebrow}</p>
          </Reveal>
          <h2 className="text-[clamp(2.75rem,5.5vw,5rem)]">
            <MaskLines lines={c.lines.map(rich)} />
          </h2>
          <Reveal delay={0.1} className="mt-12 flex items-end gap-6">
            <span className="font-display text-[6.5rem] leading-[0.8]">{rating}</span>
            <span className="pb-2">
              <Stars rating={data.rating} label={c.stars(rating)} className="text-2xl" />
              <span className="mt-2 block text-sm text-stone">{c.basedOn(data.count)}</span>
            </span>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={data.writeReviewUri} target="_blank" rel="noopener" className="btn-primary">
              {c.leave}
            </a>
            {data.mapsUri && (
              <a href={data.mapsUri} target="_blank" rel="noopener" className="btn-ghost">
                {c.readAll} <ArrowUpRight className="size-4" aria-hidden />
              </a>
            )}
          </Reveal>
          <p className="mt-8 text-xs tracking-[0.18em] text-stone uppercase">{c.from}</p>
        </div>

        <ul className="gap-5 sm:columns-2 [&>li]:mb-5 [&>li]:break-inside-avoid">
          {data.reviews.map((r, i) => {
            const long = r.text.length > MAX_CHARS
            const text = long ? `${r.text.slice(0, MAX_CHARS).replace(/\s+\S*$/, '')}…` : r.text
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 * (i % 2) }}
                className="rounded-2xl border border-line bg-surface-2 p-7"
              >
                  {r.rating && <Stars rating={r.rating} label={c.stars(String(r.rating))} className="text-base" />}
                  <blockquote lang={r.lang} className="mt-4 font-display text-[1.35rem] leading-snug">
                    “{text}”
                  </blockquote>
                  {long && r.uri && (
                    <a href={r.uri} target="_blank" rel="noopener" className="mt-3 inline-block text-sm text-accent underline-offset-4 hover:underline">
                      {c.more}
                    </a>
                  )}
                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    {r.photo && (
                      <img src={r.photo} alt="" referrerPolicy="no-referrer" loading="lazy" className="size-9 rounded-full object-cover" />
                    )}
                    <span className="min-w-0">
                      {r.authorUri ? (
                        <a href={r.authorUri} target="_blank" rel="noopener" className="block truncate text-sm font-medium hover:text-accent">
                          {r.author}
                        </a>
                      ) : (
                        <span className="block truncate text-sm font-medium">{r.author}</span>
                      )}
                      <span className="block text-xs text-stone">{r.relative}</span>
                    </span>
                  </div>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
