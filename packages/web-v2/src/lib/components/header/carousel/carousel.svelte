<script lang="ts">
	import { untrack, type Snippet } from 'svelte'
	import { setCarouselContext } from './context'
	import { useInterval, watch } from 'runed'
	import type { ClassValue } from 'svelte/elements'

	let {
		children,
		autoplay: _autoplay = true,
		class: className,
		contentClass = 'max-w-48',
	}: {
		children: Snippet
		autoplay?: boolean
		class?: ClassValue
		/** Width constraint of the stack the items are laid out in. */
		contentClass?: ClassValue
	} = $props()

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
	<div class={['grid w-full place-content-center items-center *:col-1 *:row-1', contentClass]}>
		{@render children()}
	</div>

	{#if numItems > 1}
		<div
			class="mt-1 flex w-fit items-center rounded-full border border-edge-subtle bg-surface-0/60 px-1.5 py-1 backdrop-blur-sm"
		>
			{#each Array.from({ length: numItems }) as _, index (index)}
				{@const current = index === currentIndex}

				<button
					aria-label="Highlight {index + 1} von {numItems} anzeigen"
					aria-current={current ? 'true' : undefined}
					type="button"
					onclick={() => {
						currentIndex = index
						internalAutoplay = false
					}}
					class="group grid h-5 cursor-pointer place-content-center rounded-full px-1 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
					onblur={() => (internalAutoplay = true)}
				>
					<div
						class={[
							'h-1.5 rounded-full transition-[width,background-color]',
							current ? 'w-4 bg-brand' : 'w-1.5 bg-ink/25 group-hover:bg-ink/50',
						]}
					></div>
				</button>
			{/each}
		</div>
	{/if}
</div>
