import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Pause, Play } from 'lucide-react'
import { useLang } from '@/i18n'
import { canAutoplayVideo, isSmallScreen } from '@/lib/media'
import { useLowPower } from '@/lib/perf-mode'
import { cn, publicUrl } from '@/lib/utils'

/**
 * Hero background: the poster image paints immediately (same image as the HTML
 * placeholder, so there's no flash), and the looping video only starts downloading
 * after the page has loaded, fading in once it's actually playing.
 */
export function HeroVideo() {
  const { t } = useLang()
  const ref = useRef<HTMLVideoElement>(null)
  const [enabled] = useState(canAutoplayVideo)
  const [src, setSrc] = useState<string>()
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const low = useLowPower()
  // The media sits inside the hero's slowly zooming layer; the pause button is
  // portalled into the hero itself so it isn't scaled or pushed off-screen
  const [buttonHost, setButtonHost] = useState<HTMLElement | null>(null)
  useEffect(() => setButtonHost(document.getElementById('top')), [])

  // Don't let the video compete with fonts, JS and the poster on first load
  useEffect(() => {
    if (!enabled) return
    const start = () => setSrc(publicUrl(isSmallScreen() ? 'videos/hero-960.mp4' : 'videos/hero-1920.mp4'))
    if (document.readyState === 'complete') start()
    else {
      window.addEventListener('load', start, { once: true })
      return () => window.removeEventListener('load', start)
    }
  }, [enabled])

  // Pause while scrolled out of view so it doesn't burn battery in the background
  useEffect(() => {
    const video = ref.current
    if (!video || !src) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !paused && !low) video.play().catch(() => {})
      else video.pause()
    })
    io.observe(video)
    return () => io.disconnect()
  }, [paused, src, low])

  useEffect(() => {
    if (low) ref.current?.pause()
  }, [low])

  // Driven by the user's choice, not video.paused, which is briefly true while resuming
  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (paused) video.play().catch(() => {})
    else video.pause()
    setPaused(!paused)
  }

  return (
    <>
      <img
        src={publicUrl('videos/hero-poster-1920.webp')}
        srcSet={`${publicUrl('videos/hero-poster-960.webp')} 960w, ${publicUrl('videos/hero-poster-1920.webp')} 1920w`}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {enabled && src && (
        <video
          ref={ref}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          onPlaying={() => setPlaying(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
            playing ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
      {enabled && buttonHost && createPortal(
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? t.hero.playVideo : t.hero.pauseVideo}
          className="absolute top-28 right-5 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/30 text-white transition-colors hover:bg-black/50 sm:right-8 lg:right-12"
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>,
        buttonHost,
      )}
    </>
  )
}
