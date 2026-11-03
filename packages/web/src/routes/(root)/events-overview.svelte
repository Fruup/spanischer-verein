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
	import { ArrowRightIcon, CalendarIcon } from '@lucide/svelte'
	import type { Snippet } from 'svelte'

	interface Props {
		/** MUST be sorted by `eventTime` descending */
		events: ContentApi.Event[]
	}

	let { events }: Props = $props()

	const { upcomingEvents, pastEvents } = $derived.by(() => {
		const now = Date.now()
		const pivot = events.findIndex(({ eventTime }) => new Date(eventTime).valueOf() < now)
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
			description: _noUpcomingEventsDescription,
			icon: CalendarIcon,
		})}
	{/each}

	{@render _separatorCard({
		title: t('past_events'),
		icon: ArrowRightIcon,
		description: t('past_events_description'),
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
	description: string | Snippet
})}
	{const delay = popIndex() * 100}

	<li in:fly|global={{ y: 24, delay, duration: motion(duration.slow) }} class="flex flex-col">
		<!-- Empty stand-in for the year/month label row, so the card top-aligns with the events. -->
		<div class="mb-2 flex h-6 items-center gap-1"></div>

		<article
			class="relative z-0 flex grow flex-col justify-between gap-3 overflow-clip rounded-base bg-pitch p-6 shadow-raised"
		>
			<div class="absolute inset-0 rounded-base border border-edge-subtle"></div>

			<div
				class="absolute top-0 left-0 size-12 rounded-tl-base border-t border-l border-brand mask-linear-135 mask-linear-from-0 mask-linear-to-transparent mask-linear-to-50%"
			></div>

			<div class="pointer-events-none absolute inset-0 -z-10 rounded-base">
				<div
					class="absolute inset-0 bg-radial-[at_top_right] from-background/70 to-transparent to-70%"
				></div>

				{#if Icon}
					<Icon class="absolute -right-7 -bottom-7 size-32 text-background" />
				{/if}
			</div>

			<h5 class="font-serif text-md leading-tight font-bold tracking-tight text-balance">
				{title}
			</h5>

			<div class="h-px w-1/3 bg-brand"></div>

			<div class="flex grow flex-col justify-end">
				<p class="text-sm leading-snug text-ink/80">
					{#if typeof description === 'string'}
						{description}
					{:else}
						{@render description()}
					{/if}
				</p>
			</div>
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

{#snippet _noUpcomingEventsDescription()}
	{t('no_upcoming_events_1')}
	<a
		href="/#calendar"
		class="font-serif font-semibold text-brand"
		onclick={() => {
			// TODO: highlight the calendar section when the user clicks the link, so they know where to look
			const calendarSection = document.getElementById('calendar')
			if (!calendarSection) return
		}}>{t('calendar_link_text')}</a
	>
	{t('no_upcoming_events_2')}
	<a href="/#newsletter" class="font-serif font-semibold text-brand">{t('newsletter_link_text')}</a
	>{t('no_upcoming_events_3')}
{/snippet}
