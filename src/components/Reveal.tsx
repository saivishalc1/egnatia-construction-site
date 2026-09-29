import { motion, type HTMLMotionProps } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number }

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ delay = 0, y = 32, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Splits a heading into lines that slide up from behind a mask. */
export function MaskLines({
  lines,
  className,
  delay = 0,
  animateOnMount = false,
}: {
  lines: React.ReactNode[]
  className?: string
  delay?: number
  animateOnMount?: boolean
}) {
  // The wrapper is what gets observed: the lines themselves start clipped by
  // their masks, so they would never count as "in view" on their own.
  const trigger = animateOnMount
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <motion.span className={`block ${className ?? ''}`} initial="hidden" {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/** Wipes an image in from the bottom while it settles from a slight zoom. */
export function ImageReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 1.3, ease }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1.6, ease }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
