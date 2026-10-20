<script lang="ts">
	import { untrack, type Snippet } from 'svelte'
	import { setCarouselContext } from './context'
	import { useInterval, watch } from 'runed'
	import type { ClassValue } from 'svelte/elements'

	let {
		children,
		autoplay: _autoplay = true,
		class: className,
	}: { children: Snippet; autoplay?: boolean; class?: ClassValue } = $props()

	let internalAutoplay = $state(true)
	let currentIndex = $state(0)
	let numItems = $state(0)

	const autoplay = $derived(_autoplay && internalAutoplay)

	setCarouselContext({
		get currentIndex() {
			return currentIndex
		},
		set currentIndex(value: number) {
			currentIndex = value
		},
		registerItem() {
			return numItems++
		},
	})

	const next = () => {
		currentIndex = (currentIndex + 1) % numItems
	}

	const prev = () => {
		currentIndex = (currentIndex - 1 + numItems) % numItems
	}

	const autoplayInterval = useInterval(5_000, {
		immediate: untrack(() => autoplay),
		callback() {
			next()
		},
	})

	watch(
		() => autoplay,
		(autoplay) => {
			if (autoplay) autoplayInterval.resume()
			else autoplayInterval.pause()
		},
	)
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class={['flex flex-col items-center gap-2', className]}
	tabindex="0"
	role="region"
	aria-roledescription="carousel"
	onkeydown={(e) => {
		if (e.key === 'ArrowLeft') {
			currentIndex = (currentIndex - 1 + numItems) % numItems
		} else if (e.key === 'ArrowRight') {
			currentIndex = (currentIndex + 1) % numItems
		}
	}}
	onblur={() => (internalAutoplay = true)}
>
	<div class="grid max-w-48 place-content-center items-center *:col-1 *:row-1">
		{@render children()}
	</div>

	<div class="flex w-fit">
		{#each Array.from({ length: numItems }) as _, index (index)}
			{@const current = index === currentIndex}

			<button
				title="See highlight number {index + 1}"
				type="button"
				onclick={() => {
					currentIndex = index
					internalAutoplay = false
				}}
				class={['grid size-3 cursor-pointer place-content-center']}
				onblur={() => (internalAutoplay = true)}
			>
				<div
					class={[
						'size-1.5 rounded-full border border-ink-muted bg-background transition-[background-color,transform]',
						current && 'scale-[1.5] bg-ink-muted shadow-sm',
					]}
				></div>
			</button>
		{/each}
	</div>
</div>
