import { clsx, type ClassValue } from 'clsx'

/**
 * Joins conditional class names. (tailwind-merge was dropped to save ~25 KB of
 * JavaScript: nothing here passes conflicting Tailwind classes that need resolving.)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** URL for a file in /public that also works when the site is served from a sub-folder. */
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
