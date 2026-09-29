import { useEffect, useState } from 'react'
import { useLenis } from 'lenis/react'
import type { SentEstimate } from '@/lib/estimate'
import { warmMedia } from '@/lib/warm-media'
import { Contact, Footer } from './Contact'
import { Estimator } from './Estimator'
import { Manifesto } from './Manifesto'
import { MobileCta } from './MobileCta'
import { ProcessFilm } from './ProcessFilm'
import { Reviews } from './Reviews'
import { Services } from './Services'
import { Studio } from './Studio'
import { Work } from './Work'

/**
 * Everything after the hero, split into its own JavaScript chunk so the first
 * screen doesn't wait to download and parse it.
 */
export function BelowFold() {
  const [estimate, setEstimate] = useState<SentEstimate | null>(null)
  const lenis = useLenis()

  useEffect(() => warmMedia(), [])

  // Deep links like /#estimate: the target only exists once this chunk has rendered
  useEffect(() => {
    const target = location.hash && document.querySelector(location.hash)
    if (target) requestAnimationFrame(() => target.scrollIntoView())
  }, [])

  const sendEstimate = (e: SentEstimate) => {
    setEstimate(e)
    requestAnimationFrame(() => {
      const contact = document.getElementById('contact')
      if (!contact) return
      if (lenis) lenis.scrollTo(contact, { duration: 1.4 })
      else contact.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <>
      <Manifesto />
      <Services />
      <Work />
      <Reviews />
      <ProcessFilm />
      <Estimator onSend={sendEstimate} />
      <Studio />
      <Contact estimate={estimate} />
    </>
  )
}

/** Footer and phone action bar: outside <main>, same lazy chunk. */
export function PageEnd() {
  return (
    <>
      <Footer />
      <MobileCta />
    </>
  )
}
