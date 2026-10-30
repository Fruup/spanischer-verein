<script lang="ts" module>
	/**
	 * Used for intro animation delay.
	 * When loading new events on the overview page,
	 * the delay of the first added event should be 0.
	 */
	const popIndex = (() => {
		let _index = 0
		let _timer: ReturnType<typeof setTimeout> | undefined

		return () => {
			const result = _index++

			clearTimeout(_timer)
			_timer = setTimeout(() => (_index = 0), 500)

			return result
		}
	})()
</script>

<script lang="ts">
	import EventCard from '#lib/components/event-card.svelte'
	import { fly } from 'svelte/transition'
	import { duration, motion } from '#lib/helpers/motion.js'
	import type { ContentApi } from '#lib/api/content-api.types.ts'
	import { locale } from '#lib/locale/state.svelte.ts'

	interface Props {
		events: ContentApi.Event[]
	}

	let { events: events_ }: Props = $props()

	const events = $derived(events_)

	const showYear = (eventIndex: number) => {
		if (eventIndex === 0) return true

		const event = events[eventIndex]
		const previousEvent = events.at(-1)
		if (!previousEvent) return false

		return (
			new Date(event.eventTime).getFullYear() !== new Date(previousEvent.eventTime).getFullYear()
		)
	}

	const showMonth = (eventIndex: number) => {
		if (eventIndex <= 0) return true
		if (eventIndex >= events.length) return false

		const event = events[eventIndex]
		const previousEvent = events.at(eventIndex - 1)
		if (!previousEvent) return false

		return new Date(event.eventTime).getMonth() !== new Date(previousEvent.eventTime).getMonth()
	}
</script>

<nav class="w-full">
	<ul
		class="grid w-full grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-6 p-0 max-tablet:grid-cols-1"
	>
		{#each events as event, i (event.slug)}
			{const introDelay = popIndex() * 100}
			{const showYearLabel = showYear(i)}
			{const showMonthLabel = showMonth(i)}
			{const date = new Date(event.eventTime)}
			{const monthLong = new Intl.DateTimeFormat(locale.current, { month: 'long' }).format(date)}

			<li
				in:fly|global={{ y: 24, delay: introDelay, duration: motion(duration.slow) }}
				class="flex list-none flex-col"
			>
				<div class="mb-2 flex h-6 items-center gap-1">
					{const classes =
						'rounded-full h-6 flex items-center px-2.5 text-2xs shadow-sm font-bold tracking-tight leading-none'}

					{#if showYearLabel}
						<span class={['bg-foreground text-background', classes]}>{date.getFullYear()}</span>
					{/if}

					{#if showMonthLabel}
						<span class={['bg-brand text-brand-contrast', classes]}>{monthLong}</span>
					{/if}
				</div>

				<article class="grow">
					<EventCard {event} />
				</article>
			</li>
		{/each}
	</ul>
</nav>
