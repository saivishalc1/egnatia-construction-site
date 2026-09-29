import { useSyncExternalStore } from 'react'

/**
 * Detects devices that can't sustain a smooth frame rate (Low Power Mode, older
 * laptops, budget phones) by sampling requestAnimationFrame while the page is
 * idle, and re-checks periodically so plugging in / leaving Low Power Mode
 * restores the full experience. Force it for testing with ?lowpower=1 or =0.
 */

const LOW_FPS = 50
let low = false
const listeners = new Set<() => void>()

function set(next: boolean) {
  if (next === low) return
  low = next
  document.documentElement.toggleAttribute('data-low-power', low)
  listeners.forEach((l) => l())
}

function sampleFps(ms = 1000) {
  return new Promise<number>((resolve) => {
    let frames = 0
    const start = performance.now()
    const tick = (now: number) => {
      frames++
      if (now - start < ms) requestAnimationFrame(tick)
      else resolve((frames * 1000) / (now - start))
    }
    requestAnimationFrame(tick)
  })
}

let started = false
export function startPerfMonitor() {
  if (started || typeof window === 'undefined') return
  started = true

  const forced = new URLSearchParams(location.search).get('lowpower')
  if (forced !== null) {
    set(forced === '1')
    return
  }

  let scrolling = false
  let scrollTimer = 0
  window.addEventListener(
    'scroll',
    () => {
      scrolling = true
      clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => (scrolling = false), 400)
    },
    { passive: true },
  )

  const check = async () => {
    // Hidden tabs report ~0 fps and busy scroll frames aren't representative
    if (document.visibilityState !== 'visible' || scrolling) return
    const fps = await sampleFps()
    set(fps < LOW_FPS)
  }

  const begin = () => {
    setTimeout(check, 1500)
    setInterval(check, 15000)
  }
  if (document.readyState === 'complete') begin()
  else window.addEventListener('load', begin, { once: true })
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && check())
}

export function useLowPower() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => low,
    () => false,
  )
}
