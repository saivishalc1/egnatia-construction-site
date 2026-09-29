// Dev-only helper for choosing a palette with the client. Never ships: App renders it
// only when import.meta.env.DEV is true. Delete this file once a palette is chosen.

import { useEffect, useState } from 'react'
import { Palette, X } from 'lucide-react'

const palettes = [
  { id: 'cinema', name: 'Cinema', note: 'Near-black + champagne (default)', swatch: ['#0b0a09', '#efe9df', '#d9b877'] },
  { id: 'ember', name: 'Ember', note: 'Dark + safety orange (current)', swatch: ['#0c0b0a', '#f2eee8', '#ee6a2b'] },
  { id: 'brass', name: 'Brass', note: 'Dark luxury + gold', swatch: ['#0e0d0b', '#f3efe7', '#c9a24a'] },
  { id: 'limestone', name: 'Limestone', note: 'Warm stone + gold', swatch: ['#faf9f7', '#0c0a09', '#a16207'] },
  { id: 'industrial', name: 'Industrial', note: 'Slate + safety orange', swatch: ['#f8fafc', '#0f172a', '#c2410c'] },
  { id: 'interior', name: 'Interior', note: 'Warm linen + amber', swatch: ['#faf5f2', '#1c1917', '#b45309'] },
]

export function PalettePicker() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() => document.documentElement.dataset.palette ?? 'cinema')

  useEffect(() => {
    document.documentElement.dataset.palette = active
  }, [active])

  return (
    <div className="on-dark fixed bottom-24 left-4 z-[70] lg:bottom-6">
      {open ? (
        <div className="w-64 rounded-2xl border border-line bg-surface p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-xs font-semibold tracking-[0.18em] text-stone uppercase">Palette (preview)</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close palette picker" className="cursor-pointer p-1">
              <X className="size-4" />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {palettes.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setActive(p.id)}
                  aria-pressed={active === p.id}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors ${
                    active === p.id ? 'bg-bone/10' : 'hover:bg-bone/5'
                  }`}
                >
                  <span className="flex overflow-hidden rounded-md ring-1 ring-white/15">
                    {p.swatch.map((c) => (
                      <span key={c} className="size-5" style={{ background: c }} />
                    ))}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{p.name}</span>
                    <span className="block text-xs text-stone">{p.note}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold shadow-2xl"
        >
          <Palette className="size-4 text-accent" aria-hidden /> Palettes
        </button>
      )}
    </div>
  )
}
