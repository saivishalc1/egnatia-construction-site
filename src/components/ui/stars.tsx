import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Five stars filled to the rating (to the nearest half), with an accessible label. */
export function Stars({ rating, label, className }: { rating: number; label: string; className?: string }) {
  const rounded = Math.round(rating * 2) / 2
  return (
    <span role="img" aria-label={label} className={cn('inline-flex items-center gap-0.5 text-accent', className)}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = rounded - i >= 1 ? 1 : rounded - i >= 0.5 ? 0.5 : 0
        return (
          <span key={i} className="relative inline-block size-[1em]" aria-hidden>
            <Star className="absolute inset-0 size-full opacity-30" strokeWidth={1.5} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="size-[1em] fill-current" strokeWidth={1.5} />
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
