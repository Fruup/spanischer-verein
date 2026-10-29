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

	let buttons = $state<Record<number, HTMLButtonElement | undefined>>({})
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class={[
		'flex flex-col items-center gap-2 rounded-base',
		'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand',
		className,
	]}
	tabindex="0"
	role="region"
	aria-roledescription="carousel"
	onkeydown={(e) => {
		const direction = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0
		if (!direction) return

		e.preventDefault()

		if (direction < 0) {
			currentIndex = (currentIndex - 1 + numItems) % numItems
		} else if (direction > 0) {
			currentIndex = (currentIndex + 1) % numItems
		}

		buttons[currentIndex]?.focus()
		internalAutoplay = false
	}}
	onblur={() => (internalAutoplay = true)}
>
	<!--
		The waiting cards fan down and to the right, so the stack keeps padding on
		those two sides: it both stops an ancestor from clipping the fanned edges
		and pushes the deck back up and left, which leaves the front card — the
		one that is actually being read — centred.
	-->
	<div
		class={[
			'grid w-full place-content-center items-center *:col-1 *:row-1',
			'pr-10 pb-6', // make room for card stack
			contentClass,
		]}
	>
		{@render children()}
	</div>

	{#if numItems > 1}
		<!--
			The band behind the carousel is a fixed cream in both modes, so the
			inactive dots are a fixed ink rather than the themed `ink` token,
			which would turn near-white — and invisible — in dark mode.
		-->
		<div class="flex w-fit items-center gap-0.5">
			{#each Array.from({ length: numItems }) as _, index (index)}
				{@const current = index === currentIndex}

				<button
					bind:this={buttons[index]}
					aria-label="Highlight {index + 1} von {numItems} anzeigen"
					aria-current={current ? 'true' : undefined}
					type="button"
					onclick={() => {
						currentIndex = index
						internalAutoplay = false
					}}
					class="group grid size-6 cursor-pointer place-content-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
					onblur={() => (internalAutoplay = true)}
				>
					<div
						class={[
							'h-1.5 rounded-full transition-[width,background-color]',
							current ? 'w-5 bg-brand' : 'w-1.5 bg-[#0f0f0f]/20 group-hover:bg-[#0f0f0f]/45',
						]}
					></div>
				</button>
			{/each}
		</div>
	{/if}
</div>
