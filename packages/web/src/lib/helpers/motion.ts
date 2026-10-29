import { prefersReducedMotion } from 'svelte/motion'

/**
 * Transition durations, matched to the CSS motion scale in `layout.css`.
 */
export const duration = {
	fast: 150,
	base: 250,
	slow: 400,
	/** Deliberately long: the header images crossfading between pages. */
	ambient: 900,
} as const

/**
 * Collapses a duration to nothing when the visitor has asked for less motion.
 *
 * Svelte's transitions are driven from JS, so the `prefers-reduced-motion`
 * block in `layout.css` cannot reach them — every `transition:` directive runs
 * its duration through here instead.
 */
export const motion = (ms: number) => (prefersReducedMotion.current ? 0 : ms)
