import { useId } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'

export function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={id}
          className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-display text-xl font-medium sm:text-2xl"
        >
          <span className="transition-colors duration-200 group-hover:text-accent">{q}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent"
            aria-hidden
          >
            <Plus className="size-5" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-7 text-lg text-stone">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}
