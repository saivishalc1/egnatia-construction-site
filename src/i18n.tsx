import { createContext, useContext, useEffect, useState } from 'react'
import { en, type Content } from './content/en'
import { es } from './content/es'
import { withViewTransition } from './lib/view-transition'

export type Lang = 'en' | 'es'

const dictionaries: Record<Lang, Content> = { en, es }
const STORAGE_KEY = 'egnatia-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

type LangContextValue = { lang: Lang; setLang: (lang: Lang) => void; t: Content }

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const t = dictionaries[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [lang, t])

  const setLang = (next: Lang) => {
    // Cross-fade the whole page between languages instead of text popping
    withViewTransition(() => setLangState(next))
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage unavailable */
    }
  }

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}

/** Renders `*word*` segments as the italic serif accent used in headings. */
export function rich(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <span key={i} className="font-serif font-medium tracking-[-0.02em] text-accent italic">
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  )
}
