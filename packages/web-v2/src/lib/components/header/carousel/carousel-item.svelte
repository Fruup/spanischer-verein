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

	const d = $derived(index - ctx.currentIndex)
	const t = $derived(1 / (Math.abs(d) + 1))

	const transform = $derived(`
	  translate(${Math.sign(d) * t * 20}px)
	  rotate(${d <= 0 ? 0 : (1 - t) * 6}deg)
	  scale(${d < 0 ? 1.3 : t})
	`)
</script>

<div
	style:transform
	style:opacity={d < 0 ? 0 : 1.5 * t}
	style:z-index={100 - index}
	class={[
		'origin-bottom-right overflow-clip rounded-lg transition-all',
		d === 0 && 'shadow',
		d !== 0 && 'inert pointer-events-none',
		className,
	]}
	{...rest}
>
	{@render children()}
</div>
