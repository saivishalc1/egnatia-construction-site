/**
 * CSS scroll-driven animations run on the compositor thread, so they stay smooth
 * even when JavaScript is busy. Chrome/Edge 115+ and Safari 26+ support them; other
 * browsers fall back to the Motion (JavaScript) versions of the same effects.
 */
export const scrollTimelineSupported =
  typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()')
