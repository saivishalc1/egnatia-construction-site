import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Calculator, CheckCircle2, Mail, MapPin, Phone } from 'lucide-react'
import { budgetFloors, company, estimatorAddOns, estimatorProjects, MINIMUM_PROJECT, navHrefs } from '@/data'
import { rich, useLang } from '@/i18n'
import { formatUsd, formatUsdCompact, type SentEstimate } from '@/lib/estimate'
import { cn } from '@/lib/utils'
import type { Content } from '@/content/en'
import { ContactShader } from './ContactShader'
import { Logo } from './Nav'
import { MaskLines, Reveal } from './Reveal'

type Errors = Partial<Record<'name' | 'phone' | 'email', string>>

function validate(data: FormData, e: Content['contact']['errors']): Errors {
  const errors: Errors = {}
  const name = String(data.get('name') ?? '').trim()
  const phone = String(data.get('phone') ?? '').trim()
  const email = String(data.get('email') ?? '').trim()
  if (!name) errors.name = e.name
  if (!phone && !email) errors.phone = e.reach
  if (phone && phone.replace(/\D/g, '').length < 10) errors.phone = e.phone
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = e.email
  return errors
}

/** Index of the budget option whose range contains the estimate's low end. */
function budgetIndex(low: number) {
  const i = budgetFloors.findLastIndex((floor) => low >= floor)
  return Math.max(0, i)
}

const fieldClass =
  'w-full rounded-xl border border-line bg-ink/60 px-4 py-3.5 text-base text-bone placeholder:text-stone/60 transition-colors duration-200 hover:border-bone/30 focus:border-accent focus:outline-none'

export function Contact({ estimate }: { estimate: SentEstimate | null }) {
  const { t } = useLang()
  const c = t.contact
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const money = (n: number) => formatUsdCompact(n, t.locale)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const found = validate(new FormData(form), c.errors)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    // TODO: connect to a form service (Formspree, Resend, etc.) before launch.
    setSent(true)
  }

  const message = estimate
    ? c.estimateMessage({
        project: t.estimator.projects[estimate.projectId].label,
        sqft: estimate.sqft.toLocaleString(t.locale),
        finish: t.estimator.finishes[estimate.finishId].label,
        addOns: estimatorAddOns.filter((a) => estimate.addOns.includes(a.id)).map((a) => t.estimator.addOns[a.id].label),
        range: `${money(estimate.low)} – ${money(estimate.high)}`,
      })
    : undefined

  return (
    <section id="contact" className="relative overflow-hidden bg-surface py-24 sm:py-32">
      <ContactShader />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-72 right-[-20%] size-[60rem] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--color-accent)_12%,transparent),transparent)]"
      />
      <div className="container-x relative grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div>
          <Reveal>
            <p className="eyebrow mb-6">{c.eyebrow}</p>
          </Reveal>
          <h2 className="text-[clamp(2.75rem,7vw,6.5rem)]">
            <MaskLines lines={c.lines.map(rich)} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-lg text-stone">{c.intro(formatUsd(MINIMUM_PROJECT, t.locale))}</p>
            <ul className="mt-12 flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <Phone className="mt-1 size-5 shrink-0 text-accent" aria-hidden />
                <div className="flex flex-col gap-1">
                  {company.phones.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      className="font-display text-2xl font-medium transition-colors hover:text-accent"
                    >
                      {p.display}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="size-5 shrink-0 text-accent" aria-hidden />
                <a href={`mailto:${company.email}`} className="text-lg break-all transition-colors hover:text-accent">
                  {company.email}
                </a>
              </li>
              <li className="flex items-center gap-4">
                <MapPin className="size-5 shrink-0 text-accent" aria-hidden />
                <span className="text-lg">{c.serving}</span>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="rounded-3xl border border-line bg-surface-2 p-6 shadow-sm sm:p-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex min-h-[28rem] flex-col items-start justify-center"
                  role="status"
                >
                  <CheckCircle2 className="size-12 text-accent" aria-hidden />
                  <h3 className="mt-6 text-4xl font-bold">{c.thanksTitle}</h3>
                  <p className="mt-4 max-w-sm text-lg text-stone">{c.thanksBody}</p>
                </motion.div>
              ) : (
                <motion.form
                  key={`form-${estimate?.id ?? 'blank'}`}
                  exit={{ opacity: 0, y: -12 }}
                  onSubmit={onSubmit}
                  noValidate
                  className="grid gap-5 sm:grid-cols-2"
                >
                  {estimate && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm sm:col-span-2"
                    >
                      <Calculator className="size-4 shrink-0 text-accent" aria-hidden />
                      {c.estimateAttached} {money(estimate.low)} – {money(estimate.high)}
                    </motion.p>
                  )}
                  <Field label={c.fields.name} name="name" error={errors.name} className="sm:col-span-2">
                    <input id="name" name="name" autoComplete="name" className={fieldClass} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
                  </Field>
                  <Field label={c.fields.phone} name="phone" error={errors.phone}>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className={fieldClass} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} />
                  </Field>
                  <Field label={c.fields.email} name="email" error={errors.email}>
                    <input id="email" name="email" type="email" autoComplete="email" className={fieldClass} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
                  </Field>
                  <Field label={c.fields.type} name="type">
                    <select id="type" name="type" defaultValue={estimate?.projectId ?? ''} className={cn(fieldClass, 'cursor-pointer')}>
                      <option value="" disabled>
                        {c.fields.typePlaceholder}
                      </option>
                      {estimatorProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {t.estimator.projects[p.id].label}
                        </option>
                      ))}
                      <option value="other">{c.somethingElse}</option>
                    </select>
                  </Field>
                  <Field label={c.fields.budget} name="budget">
                    <select
                      id="budget"
                      name="budget"
                      defaultValue={estimate ? String(budgetIndex(estimate.low)) : ''}
                      className={cn(fieldClass, 'cursor-pointer')}
                    >
                      <option value="" disabled>
                        {c.fields.budgetPlaceholder}
                      </option>
                      {c.budgets.map((b, i) => (
                        <option key={i} value={String(i)}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={c.fields.message} name="message" hint={c.fields.messageHint} className="sm:col-span-2">
                    <textarea id="message" name="message" rows={4} defaultValue={message} className={cn(fieldClass, 'resize-none')} aria-describedby="message-hint" />
                  </Field>
                  <button type="submit" className="btn-primary group mt-2 sm:col-span-2">
                    {c.submit}
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  error,
  hint,
  className,
  children,
}: {
  label: string
  name: string
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={name} className="text-sm font-medium text-bone/85">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${name}-hint`} className="text-sm text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Footer() {
  const { t } = useLang()
  const links = [...t.nav.links.map((label, i) => [label, navHrefs[i]]), [t.footer.about, '#faq']]

  return (
    <footer className="overflow-hidden border-t border-line pt-16 pb-28 lg:pb-10">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-stone">{t.footer.blurb(formatUsdCompact(MINIMUM_PROJECT, t.locale))}</p>
          </div>
          <nav aria-label={t.footer.nav} className="grid grid-cols-2 gap-x-14 gap-y-3 text-sm">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="text-bone/75 transition-colors hover:text-bone">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2 text-sm">
            {company.phones.map((p) => (
              <a key={p.href} href={p.href} className="text-bone/75 transition-colors hover:text-bone">
                {p.display}
              </a>
            ))}
            <a href={`mailto:${company.email}`} className="text-bone/75 transition-colors hover:text-bone">
              {company.email}
            </a>
          </div>
        </div>

        <motion.p
          aria-hidden
          initial={{ y: '40%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 bg-[linear-gradient(180deg,var(--color-bone)_20%,transparent_95%)] bg-clip-text text-center font-display text-[21vw] leading-[0.8] tracking-[-0.04em] text-transparent select-none"
        >
          EGNATIA
        </motion.p>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-sm text-stone sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName} · Brooklyn, NY
          </p>
          <a href="#top" className="transition-colors hover:text-bone">
            {t.footer.backToTop}
          </a>
        </div>
      </div>
    </footer>
  )
}
