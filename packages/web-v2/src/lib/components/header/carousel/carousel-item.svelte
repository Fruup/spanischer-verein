<script lang="ts">
	import { type Snippet } from 'svelte'
	import { getCarouselContext } from './context'
	import type { ClassValue, HTMLAttributes } from 'svelte/elements'

	let {
		children,
		class: className,
		...rest
	}: {
		children: Snippet
		class?: ClassValue
	} & Omit<HTMLAttributes<HTMLDivElement>, 'class'> = $props()

	const ctx = getCarouselContext()
	const index = ctx.registerItem()

	/** How far behind the front of the deck this card sits; negative once shown. */
	const depth = $derived(index - ctx.currentIndex)

	/**
	 * Only the front few cards are drawn as part of the deck. Anything further
	 * back parks in the last slot and fades out, so a long highlight list keeps
	 * the same silhouette as a short one instead of marching off to the side.
	 */
	const slot = $derived(Math.min(depth, 3))
	const front = $derived(depth === 0)

	/**
	 * A card leaves the deck forwards — up and slightly larger — rather than
	 * shrinking back into it, so the direction of travel stays readable. The
	 * ones still waiting step back in even increments: a small offset, a 5%
	 * scale and a degree and a half of tilt per slot, which is enough to show
	 * an edge without making the second card look like a different component.
	 */
	const transform = $derived(
		depth < 0
			? 'translate3d(-1.25rem, -0.75rem, 0) scale(1.04)'
			: `translate3d(${slot * 0.8}rem, ${slot * 0.45}rem, 0)
			   scale(${1 - slot * 0.05})
			   rotate(${slot * 1.5}deg)`,
	)

	/**
	 * The front three cards are the deck, drawn solid; the fourth is a half-lit
	 * hint that there is more behind it, and everything past that is gone. A
	 * card already shown fades right out.
	 */
	const opacity = $derived(depth < 0 || depth > 3 ? 0 : depth === 3 ? 0.5 : 1)

	/**
	 * A departing card keeps the top of the stacking order for the whole of its
	 * exit. Dropping it below the deck the moment the index moves would swap the
	 * order in a single frame — `z-index` does not interpolate — and the card
	 * behind would pop in front of one still visibly on its way out.
	 */
	const zIndex = $derived(depth < 0 ? 200 + depth : 100 - slot)
</script>

<div
	style:transform
	style:opacity
	style:z-index={zIndex}
	inert={!front}
	class={[
		'origin-bottom transition-[transform,opacity] duration-500 ease-out will-change-[transform,opacity]',
		!front && 'pointer-events-none',
		className,
	]}
	{...rest}
>
	{@render children()}
</div>
