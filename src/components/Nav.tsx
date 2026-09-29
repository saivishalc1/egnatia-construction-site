import { useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, Phone, X } from 'lucide-react'
import { company, navHrefs } from '@/data'
import { useLang, type Lang } from '@/i18n'
import { cn } from '@/lib/utils'
import { scrollTimelineSupported as sd } from '@/lib/scroll-timeline'
import { Magnetic } from './Magnetic'

export function Logo() {
  const { t } = useLang()
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label={t.nav.home}>
      <span className="leading-none">
        <span className="block font-display text-[1.7rem] tracking-[0.02em]">Egnatia</span>
        <span className="mt-1 block text-[0.6rem] font-medium tracking-[0.36em] text-stone uppercase">{t.logoSub}</span>
      </span>
    </a>
  )
}

/** EN / ES toggle with a sliding pill. */
export function LangSwitch({ id, className }: { id: string; className?: string }) {
  const { lang, setLang, t } = useLang()
  const options: { id: Lang; label: string; full: string }[] = [
    { id: 'en', label: 'EN', full: 'English' },
    { id: 'es', label: 'ES', full: 'Español' },
  ]
  return (
    <div role="group" aria-label={t.nav.language} className={cn('flex rounded-full border border-line p-1', className)}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          lang={o.id}
          aria-pressed={lang === o.id}
          aria-label={o.full}
          onClick={() => setLang(o.id)}
          className="relative min-h-9 min-w-10 cursor-pointer rounded-full px-2.5 text-xs font-semibold tracking-wider"
        >
          {lang === o.id && (
            <motion.span
              layoutId={`lang-pill-${id}`}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="absolute inset-0 rounded-full bg-bone"
            />
          )}
          <span className={cn('relative transition-colors', lang === o.id ? 'text-ink' : 'text-bone/70')}>
            {o.label}
          </span>
        </button>
      ))}
    </div>
  )
}

export function Nav() {
  const { t } = useLang()
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const hiddenRef = useRef(false)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  // Tuck the header away while reading down the page; bring it back on any scroll up
  const lenis = useLenis((l) => {
    const next = l.animatedScroll > 200 && (l.velocity > 0.5 ? true : l.velocity < -0.5 ? false : hiddenRef.current)
    if (next !== hiddenRef.current) {
      hiddenRef.current = next
      setHidden(next)
    }
  })

  // Freeze the page behind the open mobile menu
  useEffect(() => {
    if (!lenis) return
    if (open) lenis.stop()
    else lenis.start()
  }, [open, lenis])

  const showHeader = () => {
    hiddenRef.current = false
    setHidden(false)
  }

  return (
    <motion.header
      animate={{ y: hidden && !open ? '-100%' : '0%' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onFocusCapture={showHeader}
      className={cn(
        'fixed inset-x-0 top-0 z-50 text-bone transition-[background-color,border-color,backdrop-filter] duration-300',
        open
          ? 'border-b border-line bg-ink'
          : scrolled
            ? 'border-b border-line bg-ink/95'
            : 'on-dark border-b border-transparent bg-transparent',
      )}
    >
      <nav className="container-x flex h-20 items-center justify-between gap-6" aria-label={t.nav.main}>
        <Logo />

        <ul className="hidden items-center gap-8 xl:flex">
          {t.nav.links.map((label, i) => (
            <li key={navHrefs[i]}>
              <a
                href={navHrefs[i]}
                className="text-[0.7rem] font-medium tracking-[0.22em] text-bone/70 uppercase transition-colors duration-300 hover:text-bone"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 xl:flex">
          <a
            href={company.phones[0].href}
            className="hidden items-center gap-2 text-sm font-medium text-bone/75 transition-colors hover:text-bone 2xl:flex"
          >
            <Phone className="size-4 text-accent" aria-hidden />
            {company.phones[0].display}
          </a>
          <LangSwitch id="desktop" />
          <Magnetic strength={0.2}>
            <a href="#contact" className="btn-primary min-h-11">
              {t.nav.start}
            </a>
          </Magnetic>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <LangSwitch id="mobile" />
          <button
            type="button"
            className="-mr-2 flex size-11 cursor-pointer items-center justify-center"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      <motion.div
        aria-hidden
        className={`absolute inset-x-0 bottom-0 h-px origin-left bg-accent ${sd ? 'sd-page-progress' : ''}`}
        style={sd ? undefined : { scaleX: scrollYProgress }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden xl:hidden"
          >
            <ul className="container-x flex flex-col gap-1 pb-8">
              {t.nav.links.map((label, i) => (
                <li key={navHrefs[i]}>
                  <a
                    href={navHrefs[i]}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-3xl font-medium"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="mt-4 flex flex-col gap-3">
                <a href="#contact" onClick={() => setOpen(false)} className="btn-primary">
                  {t.nav.start}
                </a>
                <a href={company.phones[0].href} className="btn-ghost">
                  <Phone className="size-4" aria-hidden /> {company.phones[0].display}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
