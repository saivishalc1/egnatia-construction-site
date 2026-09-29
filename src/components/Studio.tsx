import { useState } from 'react'
import { rich, useLang } from '@/i18n'
import { FaqItem } from './Faq'
import { MaskLines, Reveal } from './Reveal'

/** About the studio and the questions people ask, side by side. */
export function Studio() {
  const { t } = useLang()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="about" className="on-light bg-ink py-28 sm:py-40">
      <div className="container-x grid gap-20 lg:grid-cols-2 lg:gap-24">
        <div>
          <Reveal>
            <p className="eyebrow mb-6">{t.about.eyebrow}</p>
          </Reveal>
          <h2 className="text-[clamp(2.75rem,5.5vw,5.25rem)]">
            <MaskLines lines={t.about.lines.map(rich)} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-xl text-lg text-stone">{t.about.body}</p>
          </Reveal>
          <dl className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {t.about.values.map((v, i) => (
              <Reveal key={i} delay={0.1 + i * 0.06} y={20} className="border-t border-line pt-5">
                <dt className="font-display text-2xl">{v.title}</dt>
                <dd className="mt-2 text-stone">{v.body}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <div id="faq" className="scroll-mt-28 lg:pt-4">
          <Reveal>
            <p className="eyebrow mb-8">{t.faq.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="border-t border-line">
              {t.faq.items.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
