<script lang="ts">
	import { CalendarDate } from '@internationalized/date'
	import { Calendar } from 'bits-ui'

	import { page } from '$app/state'
	import { locale } from '#lib/services/locale.svelte.js'

	import IconAngle from '../icons/icon-angle.svelte'
	import MonthSelector from './month-selector.svelte'
	import { getEventsForDay, type EventCalendarItem } from './helpers'

	interface Props {
		events: EventCalendarItem[]
	}

	let { events }: Props = $props()

	let selected = $derived({
		year: Number(page.params.year) || new Date().getFullYear(),
		month: Number(page.params.month) || new Date().getMonth() + 1,
	})

	let next = $derived({
		year: selected.month === 12 ? selected.year + 1 : selected.year,
		month: selected.month === 12 ? 1 : selected.month + 1,
	})

	let prev = $derived({
		year: selected.month === 1 ? selected.year - 1 : selected.year,
		month: selected.month === 1 ? 12 : selected.month - 1,
	})

	/** Navigation happens through the URL, so the view follows the route. */
	let placeholder = $derived(new CalendarDate(selected.year, selected.month, 1))

	const archiveUrl = (value: { year: number; month: number }) =>
		`/archiv/${value.year}-${value.month.toString().padStart(2, '0')}`

	const navButtonClasses =
		'grid aspect-square h-auto w-(--cell-width) cursor-pointer place-content-center rounded-base border-none bg-brand p-0 text-brand-contrast'

	const dayClasses =
		'grid aspect-square h-auto place-content-center rounded-base data-[outside-month]:opacity-50 data-today:border data-today:border-ink-muted data-today:font-bold'
</script>

<Calendar.Root
	type="single"
	readonly
	fixedWeeks
	locale={locale.current}
	calendarLabel="Veranstaltungskalender"
	{placeholder}
	data-event-calendar
	class="w-fit rounded-base bg-surface-raised p-[1em] text-[0.85rem] text-ink shadow-card [--cell-gap:0.125em] [--cell-width:2em]"
>
	{#snippet children({ months, weekdays })}
		<div class="flex items-stretch justify-between gap-1">
			<a href={archiveUrl(prev)} data-sveltekit-noscroll class={navButtonClasses}>
				<IconAngle direction="left" />
			</a>

			<MonthSelector value={selected} />

			<a href={archiveUrl(next)} data-sveltekit-noscroll class={navButtonClasses}>
				<IconAngle direction="right" />
			</a>
		</div>

		{#each months as month (month.value.toString())}
			<Calendar.Grid class="w-fit border-collapse select-none">
				<Calendar.GridHead>
					<Calendar.GridRow
						class="my-2 bg-hairline [&>th:first-child]:rounded-l-base [&>th:last-child]:rounded-r-base"
					>
						{#each weekdays as weekday, weekdayIndex (weekdayIndex)}
							<Calendar.HeadCell
								class="w-(--cell-width) p-(--cell-gap) text-center font-normal opacity-50"
							>
								{weekday}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>

				<Calendar.GridBody>
					{#each month.weeks as week, weekIndex (weekIndex)}
						<Calendar.GridRow>
							{#each week as date (date.toString())}
								{@const eventsForDay = getEventsForDay(date, events)}
								{@const event = eventsForDay[0]}

								<Calendar.Cell {date} month={month.value} class="w-(--cell-width) p-(--cell-gap)">
									<Calendar.Day>
										{#snippet child({ props, day })}
											{#if event}
												<a
													{...props}
													href={event.url}
													data-sveltekit-noscroll
													class="{dayClasses} shadow-[inset_0_0_0_2px_var(--color-brand)] {page.url
														.pathname === event.url
														? 'bg-brand text-brand-contrast'
														: ''}"
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
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	{/snippet}
</Calendar.Root>
