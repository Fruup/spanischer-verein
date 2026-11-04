<script lang="ts">
	import { DateFormatter, getLocalTimeZone, now } from '@internationalized/date'
	import { Calendar } from 'bits-ui'
	import { DragGesture } from '@use-gesture/vanilla'
	import { page } from '$app/state'
	import { getEventsForDay, type EventCalendarItem } from './helpers'
	import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte'
	import { Debounced } from 'runed'
	import { untrack } from 'svelte'
	import { SvelteMap } from 'svelte/reactivity'
	import { fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { duration, motion } from '#lib/helpers/motion.js'
	import { locale } from '#lib/locale/state.svelte.ts'
	import { t } from '#lib/messages/index.ts'
	import { createPromiseState } from '#lib/utils/index.svelte.ts'

	interface Props {
		getEvents: (year: number, month: number) => Promise<EventCalendarItem[]>
		/**
		 * Lets a horizontal drag page the month, for the touch copy in the mobile
		 * drawer. The sidebar calendar leaves it off: there is nothing to swipe
		 * with on a pointer device, and a drag across it would only fight the
		 * text selection it currently allows.
		 */
		swipeable?: boolean
	}

	let { getEvents, swipeable = false }: Props = $props()

	let placeholder = $state(now(getLocalTimeZone()))

	const dayClasses =
		'grid h-full w-full place-content-center rounded-base transition-colors data-[outside-month]:opacity-40 data-today:font-bold data-today:text-brand-link'

	const monthFormatter = $derived(new DateFormatter(locale.current, { month: 'long' }))

	const debouncedPlaceholder = new Debounced(
		() => [placeholder.year, placeholder.month] as const,
		300,
	)
	const eventsPromise = $derived(getEvents(...debouncedPlaceholder.current))
	const events = $derived(createPromiseState(eventsPromise))

	/** How far a month slides in/out, in pixels. */
	const flyDistance = 40

	/** Single key for a year/month pair, used for ordering and for the cache below. */
	const indexOfMonth = (year: number, month: number) => year * 12 + month

	const monthIndex = $derived(indexOfMonth(placeholder.year, placeholder.month))
	const loadedMonthIndex = $derived(indexOfMonth(...debouncedPlaceholder.current))

	/**
	 * Events per month, so a grid only ever highlights days it actually has data
	 * for. Without this the fetch lags the grid by the debounce interval and the
	 * previous month's events briefly highlight the new month's outside-month
	 * cells — and the outgoing month loses its highlights while it flies out.
	 *
	 * Doubles as a cache: revisiting a month paints it immediately.
	 */
	const eventsByMonth = new SvelteMap<number, EventCalendarItem[]>()

	$effect(() => {
		if (!events.current) return

		// `events` is rebuilt whenever the promise changes, so a resolved value
		// always belongs to the month that `loadedMonthIndex` currently names.
		eventsByMonth.set(loadedMonthIndex, events.current)
	})

	/**
	 * `1` when the visitor moved forward in time, `-1` backward — the month grid
	 * flies in from that side. Derived from the placeholder rather than the
	 * prev/next buttons so keyboard navigation across a month boundary animates
	 * the same way.
	 */
	let direction = $state(1)
	let previousMonthIndex = untrack(() => monthIndex)

	// Runs before the DOM update, so the keyed `{#each months}` block below
	// already sees the new direction when it creates the transition.
	$effect.pre(() => {
		if (monthIndex === previousMonthIndex) return

		direction = Math.sign(monthIndex - previousMonthIndex)
		previousMonthIndex = monthIndex
	})

	/** A flick this far across pages the month, however slowly it was made. */
	const swipeDistance = 60

	/** …and a shorter one still counts if it was thrown rather than dragged. */
	const swipeVelocity = 0.35
	const flickDistance = 20

	let swipeTarget = $state<HTMLElement>()

	$effect(() => {
		if (!swipeable || !swipeTarget) return

		const gesture = new DragGesture(
			swipeTarget,
			({ last, movement: [mx], velocity: [vx], direction: [dx] }) => {
				// Only the end of the drag moves the month: the grid animates itself,
				// so there is nothing to drag along underneath the finger.
				if (!last) return

				const dragged = Math.abs(mx) > swipeDistance
				const flicked = vx > swipeVelocity && Math.abs(mx) > flickDistance
				if (!dragged && !flicked) return

				// Dragging the grid leftwards pulls the next month in from the right.
				placeholder = placeholder.add({ months: (dragged ? Math.sign(mx) : dx) < 0 ? 1 : -1 })
			},
			{
				/*
					Horizontal drags only. A vertical one is left strictly alone — no
					handling, no `preventDefault` — because it belongs to whatever the
					calendar is sitting in: in the mobile drawer that is the sheet's own
					pull-to-dismiss, and claiming the vertical axis here (with a
					`touch-action` of `pan-y`, say) stops the sheet closing when it is
					pulled down over the calendar.
				*/
				axis: 'x',
				// A tap on a day is a link, not a one-pixel drag.
				filterTaps: true,
				/*
					`capture: false` leaves the pointer where it was. The drawer this
					sits in captures the pointer itself to drive its own drag, and two
					captures on one gesture means the later one wins and the other
					component stops hearing about the finger; listening on the document
					instead keeps both working.
				*/
				pointer: { touch: true, capture: false },
			},
		)

		return () => gesture.destroy()
	})
</script>

<div bind:this={swipeTarget} class="w-full">
	<Calendar.Root
		id="calendar"
		type="single"
		fixedWeeks
		locale={locale.current}
		calendarLabel={t('event_calendar_label')}
		weekStartsOn={1}
		bind:placeholder
		data-event-calendar
		class="@container w-full rounded-base border border-edge-subtle bg-surface-raised p-4 text-ink shadow-raised select-none [--cell-gap:0.125em]"
	>
		{#snippet children({ months, weekdays })}
			<div class="flex items-stretch justify-between gap-1 text-xs">
				<Calendar.PrevButton class="cursor-pointer rounded hover:bg-muted">
					<ChevronLeftIcon class="size-4" />
				</Calendar.PrevButton>

				<div class={['font-semibold', !eventsByMonth.has(monthIndex) && 'shimmer']}>
					{monthFormatter.format(placeholder.toDate())}
				</div>

				<Calendar.NextButton class="cursor-pointer rounded hover:bg-muted">
					<ChevronRightIcon class="size-4" />
				</Calendar.NextButton>
			</div>

			<!--
			The grid is laid out as CSS grid instead of a table so that every month
			body can share one cell: the outgoing and incoming month overlap while
			they fly past each other, and `fixedWeeks` keeps both six rows tall so
			the card never changes height mid-animation.
		-->
			<Calendar.Grid
				class="mt-2 grid w-full grid-cols-1 grid-rows-[auto_auto] overflow-hidden text-xs select-none"
			>
				<Calendar.GridHead class="col-start-1 row-start-1 grid">
					<Calendar.GridRow
						class="mb-1 grid w-full grid-cols-[repeat(7,1fr)] rounded-base bg-hairline"
					>
						{#each weekdays as weekday, weekdayIndex (weekdayIndex)}
							<Calendar.HeadCell
								class="w-auto min-w-0 p-(--cell-gap) text-center text-2xs font-normal tracking-label text-ink-muted"
							>
								{weekday}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>

				{#each months as month (month.value.toString())}
					{@const monthEvents =
						eventsByMonth.get(indexOfMonth(month.value.year, month.value.month)) ?? []}

					<Calendar.GridBody>
						{#snippet child({ props })}
							<tbody
								{...props}
								class="col-start-1 row-start-2 grid w-full"
								in:fly|global={{
									x: direction * flyDistance,
									duration: motion(duration.fast),
									easing: cubicOut,
									delay: motion(duration.fast),
								}}
								out:fly|global={{
									x: direction * -flyDistance,
									duration: motion(duration.fast),
									easing: cubicOut,
								}}
							>
								{#each month.weeks as week, weekIndex (weekIndex)}
									<Calendar.GridRow class="grid w-full grid-cols-[repeat(7,1fr)]">
										{#each week as date (date.toString())}
											{@const eventsForDay = getEventsForDay(date, monthEvents)}
											{@const event = eventsForDay.at(0)}

											<Calendar.Cell
												{date}
												month={month.value}
												class="block aspect-square h-auto w-auto min-w-0 p-(--cell-gap)"
											>
												<Calendar.Day>
													{#snippet child({ props, day })}
														{#if event}
															{const active = page.url.pathname === event.url}

															<a
																{...props}
																href={event.url}
																class={[
																	'bg-brand font-bold text-brand-contrast ring-2 ring-brand focus-ring transition-colors ring-inset',
																	active && 'bg-brand-contrast text-foreground',
																	dayClasses,
																]}
															>
																{day}
															</a>
														{:else}
															<div {...props} class={dayClasses}>{day}</div>
														{/if}
													{/snippet}
												</Calendar.Day>
											</Calendar.Cell>
										{/each}
									</Calendar.GridRow>
								{/each}
							</tbody>
						{/snippet}
					</Calendar.GridBody>
				{/each}
			</Calendar.Grid>
		{/snippet}
	</Calendar.Root>
</div>
