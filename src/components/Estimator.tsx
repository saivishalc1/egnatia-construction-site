import { useId, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ArrowRight, Check, CircleCheck, Clock, Info, Plus } from 'lucide-react'
import NumberTicker from './ui/number-ticker'
import { BorderBeam } from './ui/border-beam'
import { estimatorAddOns, estimatorProjects, finishLevels, MINIMUM_PROJECT } from '@/data'
import { rich, useLang } from '@/i18n'
import {
  calculateEstimate,
  formatUsd,
  formatUsdCompact,
  type EstimateInput,
  type SentEstimate,
} from '@/lib/estimate'
import { cn } from '@/lib/utils'
import { MaskLines, Reveal } from './Reveal'

const spring = { type: 'spring', stiffness: 260, damping: 30 } as const
const compact = { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 } as const

export function Estimator({ onSend }: { onSend: (estimate: SentEstimate) => void }) {
  const { t } = useLang()
  const c = t.estimator
  const [input, setInput] = useState<EstimateInput>({
    projectId: 'whole-home',
    sqft: 1800,
    finishId: 'premium',
    addOns: ['systems', 'permits'],
  })

  const project = estimatorProjects.find((p) => p.id === input.projectId)!
  const result = useMemo(() => calculateEstimate(input), [input])

  const selectProject = (id: string) => {
    const next = estimatorProjects.find((p) => p.id === id)!
    setInput((s) => ({ ...s, projectId: id, sqft: next.sqft.default }))
  }

  const toggleAddOn = (id: string) =>
    setInput((s) => ({
      ...s,
      addOns: s.addOns.includes(id) ? s.addOns.filter((a) => a !== id) : [...s.addOns, id],
    }))

  const send = () => onSend({ ...input, id: Date.now(), low: result.low, high: result.high })

  return (
    <section id="estimate" className="on-light relative bg-ink py-24 sm:py-32">
      <div className="container-x">
        <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-6">{c.eyebrow}</p>
            </Reveal>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)]">
              <MaskLines lines={c.lines.map(rich)} />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-md text-lg text-stone lg:ml-auto">{c.intro(formatUsd(MINIMUM_PROJECT, t.locale))}</p>
          </Reveal>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          {/* ─── Controls ─── */}
          <Reveal className="flex flex-col gap-10">
            <fieldset>
              <legend className="mb-4 font-display text-lg font-medium">{c.projectLegend}</legend>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-3">
                {estimatorProjects.map((p) => {
                  const checked = p.id === input.projectId
                  return (
                    <label
                      key={p.id}
                      className={cn(
                        'group relative isolate flex min-h-20 cursor-pointer flex-col justify-between rounded-2xl border p-3.5 transition-colors duration-200 sm:min-h-24 sm:p-4',
                        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
                        checked ? 'border-accent' : 'border-line hover:border-bone/30',
                      )}
                    >
                      <input
                        type="radio"
                        name="project"
                        value={p.id}
                        checked={checked}
                        onChange={() => selectProject(p.id)}
                        className="sr-only"
                      />
                      {checked && (
                        <motion.span
                          layoutId="project-highlight"
                          transition={spring}
                          className="absolute inset-0 -z-10 rounded-2xl bg-accent/10"
                        />
                      )}
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-sm leading-snug font-semibold sm:text-base">{c.projects[p.id].label}</span>
                        <span
                          className={cn(
                            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                            checked ? 'border-accent bg-accent text-on-accent' : 'border-bone/30',
                          )}
                        >
                          {checked && <Check className="size-3" strokeWidth={3} />}
                        </span>
                      </span>
                      <span className="mt-2 hidden text-sm text-stone sm:block">{c.projects[p.id].blurb}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <SizeSlider value={input.sqft} range={project.sqft} onChange={(sqft) => setInput((s) => ({ ...s, sqft }))} />

            <fieldset>
              <legend className="mb-4 font-display text-lg font-medium">{c.finishLegend}</legend>
              <div className="grid grid-cols-3 rounded-2xl border border-line p-1.5">
                {finishLevels.map((f) => {
                  const checked = f.id === input.finishId
                  return (
                    <label
                      key={f.id}
                      className="relative flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-2 text-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
                    >
                      <input
                        type="radio"
                        name="finish"
                        value={f.id}
                        checked={checked}
                        onChange={() => setInput((s) => ({ ...s, finishId: f.id }))}
                        className="sr-only"
                      />
                      {checked && (
                        <motion.span layoutId="finish-pill" transition={spring} className="absolute inset-0 rounded-xl bg-bone" />
                      )}
                      <span
                        className={cn(
                          'relative text-sm font-semibold transition-colors duration-200',
                          checked ? 'text-ink' : 'text-bone/75',
                        )}
                      >
                        {c.finishes[f.id].label}
                      </span>
                    </label>
                  )
                })}
              </div>
              <p className="mt-3 text-sm text-stone">{c.finishes[input.finishId].blurb}</p>
            </fieldset>

            <fieldset>
              <legend className="mb-4 font-display text-lg font-medium">
                {c.addOnsLegend} <span className="font-sans text-sm font-normal text-stone">{c.optional}</span>
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {estimatorAddOns.map((a) => {
                  const checked = input.addOns.includes(a.id)
                  return (
                    <label
                      key={a.id}
                      title={c.addOns[a.id].detail}
                      className={cn(
                        'flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200',
                        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
                        checked
                          ? 'border-accent bg-accent/10 text-bone'
                          : 'border-line text-bone/75 hover:border-bone/30 hover:text-bone',
                      )}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggleAddOn(a.id)} className="sr-only" />
                      <motion.span
                        animate={{ rotate: checked ? 45 : 0 }}
                        transition={spring}
                        aria-hidden
                        className={cn('flex', checked ? 'text-accent' : 'text-stone')}
                      >
                        <Plus className="size-4" />
                      </motion.span>
                      {c.addOns[a.id].label}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {/* Phones: keep the running total in view while adjusting */}
            <a
              href="#estimate-result"
              className="sticky bottom-3 z-10 flex items-center justify-between gap-4 rounded-full border border-line bg-surface-2 py-2 pr-2 pl-5 shadow-lg lg:hidden"
            >
              <span className="font-display text-lg font-medium lining-nums tabular-nums">
                <NumberTicker value={result.low} locales={t.locale} format={compact} /> –{' '}
                <NumberTicker value={result.high} locales={t.locale} format={compact} />
              </span>
              <span className="btn-primary min-h-10 px-4 text-xs">{c.seeEstimate}</span>
            </a>
          </Reveal>

          {/* ─── Result ─── */}
          <Reveal delay={0.1} id="estimate-result" className="scroll-mt-24 lg:sticky lg:top-28 lg:self-start">
            <ResultCard result={result} onSend={send} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function SizeSlider({
  value,
  range,
  onChange,
}: {
  value: number
  range: { min: number; max: number; step: number }
  onChange: (value: number) => void
}) {
  const { t } = useLang()
  const id = useId()
  const fill = ((value - range.min) / (range.max - range.min)) * 100
  const n = (x: number) => x.toLocaleString(t.locale)

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-display text-lg font-medium">
          {t.estimator.sizeLabel}
        </label>
        <span className="font-display text-2xl font-medium lining-nums tabular-nums">
          <NumberTicker value={value} locales={t.locale} format={{ maximumFractionDigits: 0 }} />
          <span className="ml-1.5 text-base font-medium text-stone">{t.estimator.sqft}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={range.min}
        max={range.max}
        step={range.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${n(value)} ${t.estimator.sqftLong}`}
        className="range-input w-full"
        style={{ '--fill': `${fill}%` } as React.CSSProperties}
      />
      <div className="mt-2 flex justify-between text-xs text-stone tabular-nums">
        <span>
          {n(range.min)} {t.estimator.sqft}
        </span>
        <span>
          {n(range.max)} {t.estimator.sqft}
        </span>
      </div>
    </div>
  )
}

function ResultCard({ result, onSend }: { result: ReturnType<typeof calculateEstimate>; onSend: () => void }) {
  const { t } = useLang()
  const c = t.estimator
  const money = (n: number) => formatUsdCompact(n, t.locale)

  // Bar scale grows with the estimate so the $150K marker stays meaningful.
  const scaleMax = Math.max(result.high * 1.25, MINIMUM_PROJECT * 2.5)
  const pct = (n: number) => `${Math.min(100, (n / scaleMax) * 100)}%`
  const bandWidth = `${Math.max(1.5, ((result.high - result.low) / scaleMax) * 100)}%`
  const status = c.status[result.status]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <BorderBeam size={120} duration={9} borderWidth={1.5} colorFrom="var(--accent-bright)" colorTo="var(--color-accent)" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[28rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent)]"
      />

      <p className="relative text-sm font-semibold tracking-[0.2em] text-stone uppercase">{c.resultLabel}</p>
      <p className="relative mt-3 flex flex-wrap items-baseline gap-x-3 font-display text-[clamp(2.1rem,9vw,3.75rem)] leading-none">
        <NumberTicker value={result.low} locales={t.locale} format={compact} />
        <span className="text-stone">–</span>
        <NumberTicker value={result.high} locales={t.locale} format={compact} />
      </p>

      {/* Range vs. minimum */}
      <div className="relative mt-8" aria-hidden>
        <div className="relative h-2 rounded-full bg-bone/10">
          <motion.div
            className="absolute inset-y-0 rounded-full bg-accent"
            animate={{ left: pct(result.low), width: bandWidth }}
            transition={spring}
          />
          <motion.div
            className="absolute -top-2 -bottom-2 w-px bg-bone"
            animate={{ left: pct(MINIMUM_PROJECT) }}
            transition={spring}
          />
        </div>
        <div className="relative mt-3 h-4 text-xs text-stone">
          <motion.span
            className="absolute -translate-x-1/2 whitespace-nowrap"
            animate={{ left: pct(MINIMUM_PROJECT) }}
            transition={spring}
          >
            {c.minimumMarker}
          </motion.span>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={result.status}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={cn(
            'relative mt-7 flex gap-3 rounded-2xl border p-4 text-sm',
            result.status === 'fit' && 'border-ok/30 bg-ok/5',
            result.status === 'borderline' && 'border-accent/30 bg-accent/5',
            result.status === 'below' && 'border-warn/30 bg-warn/5',
          )}
        >
          {result.status === 'fit' && <CircleCheck className="mt-0.5 size-5 shrink-0 text-ok" aria-hidden />}
          {result.status === 'borderline' && <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />}
          {result.status === 'below' && <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warn" aria-hidden />}
          <p className="text-bone/85">
            <strong className="font-semibold text-bone">{status.title}</strong> {status.body}
          </p>
        </motion.div>
      </AnimatePresence>

      <dl className="relative mt-7 divide-y divide-line text-sm">
        <Row label={c.rows.base} value={money(result.base)} />
        <Row label={c.rows.finish} value={result.finishExtra > 0 ? `+${money(result.finishExtra)}` : c.included} />
        <Row label={c.rows.addOns} value={result.addOnTotal > 0 ? `+${money(result.addOnTotal)}` : c.none} />
        <Row
          label={
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-stone" aria-hidden /> {c.rows.timeline}
            </span>
          }
          value={c.timelines[result.timelineIndex]}
        />
      </dl>

      <div className="relative mt-8">
        {result.status === 'below' ? (
          <a href="#estimate" className="btn-ghost w-full">
            {c.adjust}
          </a>
        ) : (
          <button type="button" onClick={onSend} className="btn-primary group w-full">
            {c.send}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
          </button>
        )}
        <p className="mt-4 text-xs leading-relaxed text-stone">{c.disclaimer}</p>
      </div>

      <p className="sr-only" aria-live="polite">
        {c.live(formatUsd(result.low, t.locale), formatUsd(result.high, t.locale), result.status === 'below')}
      </p>
    </div>
  )
}

function Row({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-stone">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  )
}
