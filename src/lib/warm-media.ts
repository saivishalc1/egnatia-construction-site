/**
 * After the page settles, quietly fetch and pre-decode every lazy image so fast
 * (Lenis) scrolling never catches one mid-download or mid-decode. Skipped on
 * data-saver connections, where lazy loading is the better trade.
 */
export function warmMedia() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (connection?.saveData || /2g/.test(connection?.effectiveType ?? '')) return () => {}

  const idle = (cb: () => void) =>
    'requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 1200)

  let cancelled = false
  const run = () =>
    idle(async () => {
      const images = Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'))
      // Nearest first, a couple at a time, so we never compete with what's on screen
      images.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
      for (let i = 0; i < images.length && !cancelled; i += 2) {
        await Promise.all(
          images.slice(i, i + 2).map((img) => {
            img.loading = 'eager'
            return img.decode().catch(() => {})
          }),
        )
      }
    })

  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })

  return () => {
    cancelled = true
    window.removeEventListener('load', run)
  }
}
