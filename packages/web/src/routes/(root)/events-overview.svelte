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
	import { ArrowRightIcon } from '@lucide/svelte'

	interface Props {
		/** MUST be sorted by `eventTime` descending */
		events: ContentApi.Event[]
	}

	let { events }: Props = $props()

	const { upcomingEvents, pastEvents } = $derived.by(() => {
		const now = Date.now()
		const pivot = events.findIndex(({ eventTime }) => new Date(eventTime).valueOf() < now)
		// const pivot = 0
		return {
			upcomingEvents: events.slice(0, pivot).toReversed(),
			pastEvents: events.slice(pivot),
		}
	})

	const showYear = (eventIndex: number) => {
		if (eventIndex === 0) return true

		const event = events[eventIndex]
		const previousEvent = events.at(eventIndex - 1)
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

	const longMonthFormatter = $derived(new DateFormatter(locale.current, { month: 'long' }))
</script>

<ul
	class="grid w-full grid-cols-[repeat(3,minmax(230px,1fr))] gap-6 p-0 *:list-none max-tablet:grid-cols-1"
>
	{#each upcomingEvents as event, i (event.slug)}
		{@render _event(event, i)}
	{:else}
		{@render _separatorCard({
			title: t('no_upcoming_events'),
			description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, vero adipisci, officia
						at ullam voluptatem amet placeat ipsam deleniti numquam eligendi similique laboriosam
						aperiam.`,
		})}
	{/each}

	{@render _separatorCard({
		title: t('past_events'),
		icon: ArrowRightIcon,
		description: `Ab hier findest du alle vergangenen Events. Schau dich um und entdecke, was wir in der Vergangenheit alles veranstaltet haben.`,
	})}

	{#each pastEvents as event, i (event.slug)}
		{@render _event(event, i)}
	{/each}
</ul>

{#snippet _separatorCard({
	title,
	icon: Icon,
	description,
}: {
	title: string
	icon?: typeof ArrowRightIcon
	description: string
})}
	{const delay = popIndex() * 100}

	<li in:fly|global={{ y: 24, delay, duration: motion(duration.slow) }} class="flex flex-col">
		<div class="mb-2 flex h-6 items-center gap-1"></div>

		<article
			class="relative flex grow flex-col justify-between overflow-clip rounded-base border border-edge-subtle p-6 shadow-raised"
		>
			<div
				class="absolute inset-0 bottom-1/2 -z-10 bg-radial-[at_top_right] from-brand/15 to-brand/1"
				style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 70%)"
			></div>

			<h5 class="-my-1 font-serif text-lg leading-tight font-bold hyphens-auto">
				{#if Icon}
					<Icon class="float-right size-8" />
				{/if}

				{title}
			</h5>

			<p class="text-sm leading-snug text-ink-muted">{description}</p>
		</article>
	</li>
{/snippet}

{#snippet _event(event: ContentApi.Event, index: number)}
	{const introDelay = popIndex() * 100}
	{const showYearLabel = $derived(showYear(index))}
	{const showMonthLabel = $derived(showMonth(index))}
	{const date = $derived(new Date(event.eventTime))}
	{const monthLong = $derived(longMonthFormatter.format(date))}

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
{/snippet}
