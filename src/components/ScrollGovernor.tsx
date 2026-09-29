import { useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import { startPerfMonitor, useLowPower } from '@/lib/perf-mode'

/**
 * Chrome and Safari report trackpad scrolls with wheelDeltaY === -3 * deltaY;
 * notched mouse wheels report ±120 steps instead.
 */
function isTrackpad(e: WheelEvent) {
  const legacy = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY
  if (typeof legacy === 'number' && legacy !== 0) return legacy === -3 * e.deltaY
  return e.deltaMode === 0 && Math.abs(e.deltaY) < 60
}

/**
 * Decides, per wheel event, who drives the scroll:
 * - Trackpads and Magic Mouse already have Apple's momentum. Smoothing on top adds
 *   lag, so they get the browser's native, compositor-driven scrolling.
 * - Notched mouse wheels get Lenis smoothing (where it genuinely helps)...
 * - ...unless the device can't hold ~60fps, where everything goes native.
 */
export function ScrollGovernor() {
  const lenis = useLenis()
  const low = useLowPower()
  const lowRef = useRef(low)
  lowRef.current = low

  useEffect(() => startPerfMonitor(), [])

  useEffect(() => {
    if (!lenis) return
    // Capture phase on window runs before Lenis's own wheel listener sees the event
    const onWheel = (e: WheelEvent) => {
      lenis.options.smoothWheel = !lowRef.current && !isTrackpad(e)
    }
    window.addEventListener('wheel', onWheel, { capture: true, passive: true })
    return () => window.removeEventListener('wheel', onWheel, { capture: true })
  }, [lenis])

  useEffect(() => {
    if (lenis && low) lenis.options.smoothWheel = false
  }, [lenis, low])

  return null
}
