import { useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import { ArrowRight, X } from 'lucide-react'
import { useLang } from '@/i18n'
import { StockImage } from './ui/stock-image'

type Project = { title: string; type: string; image: string }

/**
 * Full-screen project view. Its photo shares a view-transition-name with the card
 * it was opened from, so the browser morphs the card into this view and back.
 */
export function ProjectDialog({
  project,
  index,
  onClose,
}: {
  project: Project
  index: number
  onClose: (then?: () => void) => void
}) {
  const { t } = useLang()
  const lenis = useLenis()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    lenis?.stop()
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [lenis, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      className="on-dark fixed inset-0 z-[90] flex items-center justify-center bg-[rgb(12_11_10/0.97)] p-4 sm:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      data-lenis-prevent
    >
      <div className="relative w-full max-w-5xl">
        <div
          className="mx-auto aspect-[4/3] max-h-[68svh] overflow-hidden rounded-2xl bg-surface sm:aspect-[16/10]"
          style={{ viewTransitionName: `project-${index}` }}
        >
          <StockImage
            id={project.image}
            sizes="(min-width: 1024px) 64rem, 92vw"
            loading="eager"
            alt={`${project.title}, ${project.type.toLowerCase()}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" style={{ viewTransitionName: 'project-meta' }}>
          <div>
            <p className="text-sm tracking-[0.2em] text-accent uppercase">{project.type}</p>
            <h2 id="project-title" className="mt-2 text-3xl font-bold sm:text-4xl">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onClose(() => document.getElementById('contact')?.scrollIntoView())}
            className="btn-primary group self-start sm:self-auto"
          >
            {t.work.similar}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={() => onClose()}
          aria-label={t.work.close}
          className="absolute -top-3 -right-3 flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-ink text-bone transition-colors hover:border-accent sm:-top-4 sm:-right-4"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  )
}
