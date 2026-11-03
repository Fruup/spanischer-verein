<script lang="ts" module>
	/**
	 * Highest stagger step handed out. Without a cap, a page of 30 events would
	 * delay its last card by 3s, long after the user has scrolled past it.
	 */
	const maxStaggerStep = 8

	/**
	 * Used for intro animation delay.
	 * When loading new events on the overview page,
	 * the delay of the first added event should be 0.
	 */
	const popIndex = (() => {
		let _index = 0
		let _timer: ReturnType<typeof setTimeout> | undefined

		return () => {
			const result = Math.min(_index++, maxStaggerStep)

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
	import { t } from '#lib/messages/index.ts'
	import { DateFormatter } from '@internationalized/date'

	interface Props {
		/** MUST be sorted by `eventTime` descending */
		events: ContentApi.Event[]
	}

	let { events: events_ }: Props = $props()

	const { upcomingEvents, pastEvents } = $derived.by(() => {
		const now = Date.now()
		const pivot = events_.findIndex(({ eventTime }) => new Date(eventTime).valueOf() < now)
		return {
			upcomingEvents: events_.slice(0, pivot).toReversed(),
			pastEvents: events_.slice(pivot),
		}
	})

	const showYear = (events: ContentApi.Event[], eventIndex: number) => {
		if (eventIndex === 0) return true

		const event = events[eventIndex]
		const previousEvent = events.at(eventIndex - 1)
		if (!previousEvent) return false

		return (
			new Date(event.eventTime).getFullYear() !== new Date(previousEvent.eventTime).getFullYear()
		)
	}

	const showMonth = (events: ContentApi.Event[], eventIndex: number) => {
		if (eventIndex <= 0) return true
		if (eventIndex >= events.length) return false

		const event = events[eventIndex]
		const previousEvent = events.at(eventIndex - 1)
		if (!previousEvent) return false

		return new Date(event.eventTime).getMonth() !== new Date(previousEvent.eventTime).getMonth()
	}
</script>

<section class="w-full space-y-4">
	{#if upcomingEvents.length === 0}
		<p class="text-xs text-ink-muted">{t('no_upcoming_events')}</p>
	{:else}
		<ul
			class={[
				'grid w-full grid-cols-[repeat(3,minmax(230px,1fr))] gap-6 p-0 *:list-none max-tablet:grid-cols-1',
			]}
		>
			{#each upcomingEvents as event (event.slug)}
				{const introDelay = popIndex() * 100}
				{const horizontal = $derived(upcomingEvents.length < 3)}

				<li
					in:fly|global={{ y: 24, delay: introDelay, duration: motion(duration.slow) }}
					class={['flex flex-col', horizontal && 'col-span-3 max-tablet:col-span-1']}
				>
					<article class="grow">
						<EventCard {event} {horizontal} />
					</article>
				</li>
			{/each}
		</ul>
	{/if}

	<div class="my-8 h-px w-2/3 bg-brand"></div>

	<h4 class="font-serif text-lg font-bold">{t('past_events')}</h4>

	<ul
		class="grid w-full grid-cols-[repeat(3,minmax(230px,1fr))] gap-6 p-0 *:list-none max-tablet:grid-cols-1"
	>
		{#each pastEvents as event, i (event.slug)}
			{const introDelay = popIndex() * 100}
			{const showYearLabel = $derived(showYear(pastEvents, i))}
			{const showMonthLabel = $derived(showMonth(pastEvents, i))}
			{const date = $derived(new Date(event.eventTime))}
			{const monthLong = $derived(
				new DateFormatter(locale.current, { month: 'long' }).format(date),
			)}

			<li
				in:fly|global={{ y: 24, delay: introDelay, duration: motion(duration.slow) }}
				class="flex flex-col"
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
</section>
