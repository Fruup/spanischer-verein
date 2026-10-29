<script lang="ts">
	import { DateFormatter, getLocalTimeZone, now } from '@internationalized/date'
	import { Calendar } from 'bits-ui'
	import { page } from '$app/state'
	import { getEventsForDay, type EventCalendarItem } from './helpers'
	import { ChevronLeftIcon, ChevronRightIcon } from '@lucide/svelte'
	import { Debounced } from 'runed'
	import { locale } from '#lib/locale/state.svelte.ts'

	const wrap = <T,>(promise: Promise<T>) => {
		let current = $state<T>()
		let error = $state<unknown>()
		let loading = $state(true)

		promise
			.then((value) => {
				current = value
			})
			.catch((e) => {
				error = e
			})
			.finally(() => {
				loading = false
			})

		return {
			get current() {
				return current
			},
			get error() {
				return error
			},
			get loading() {
				return loading
			},
		}
	}

	interface Props {
		getEvents: (year: number, month: number) => Promise<EventCalendarItem[]>
	}

	let { getEvents }: Props = $props()

	let placeholder = $state(now(getLocalTimeZone()))

	const dayClasses =
		'grid h-full w-full place-content-center rounded-base transition-colors data-[outside-month]:opacity-40 data-today:font-bold data-today:text-brand-link'

	const monthFormatter = $derived(new DateFormatter(locale.current, { month: 'long' }))

	const debouncedPlaceholder = new Debounced(
		() => [placeholder.year, placeholder.month] as const,
		300,
	)
	const eventsPromise = $derived(getEvents(...debouncedPlaceholder.current))
	const events = $derived(wrap(eventsPromise))
</script>

<Calendar.Root
	type="single"
	fixedWeeks
	locale={locale.current}
	calendarLabel="Veranstaltungskalender"
	weekStartsOn={1}
	bind:placeholder
	data-event-calendar
	class="@container w-full rounded-base border border-edge-subtle bg-surface-raised p-4 text-ink shadow-raised select-none [--cell-gap:0.125em]"
>
	{#snippet children({ months, weekdays })}
		<div class="flex items-stretch justify-between gap-1 text-xs">
			<Calendar.PrevButton>
				<ChevronLeftIcon class="size-4" />
			</Calendar.PrevButton>

			<div class={['font-semibold', events.loading && 'shimmer']}>
				{monthFormatter.format(placeholder.toDate())}
			</div>

			<Calendar.NextButton>
				<ChevronRightIcon class="size-4" />
			</Calendar.NextButton>
		</div>

		{#each months as month (month.value.toString())}
			<Calendar.Grid class="mt-2 w-full border-collapse text-xs select-none">
				<Calendar.GridHead>
					<Calendar.GridRow class="grid w-full grid-cols-[repeat(7,1fr)] rounded-base bg-hairline">
						{#each weekdays as weekday, weekdayIndex (weekdayIndex)}
							<Calendar.HeadCell
								class="w-auto min-w-0 p-(--cell-gap) text-center text-2xs font-normal tracking-label text-ink-muted"
							>
								{weekday}
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>

				<Calendar.GridBody class="w-full">
					{#each month.weeks as week, weekIndex (weekIndex)}
						<Calendar.GridRow class="grid w-full grid-cols-[repeat(7,1fr)]">
							{#each week as date (date.toString())}
								{@const eventsForDay = getEventsForDay(date, events.current ?? [])}
								{@const event = eventsForDay.at(0)}

								<Calendar.Cell
									{date}
									month={month.value}
									class="block aspect-square h-auto w-auto min-w-0 p-(--cell-gap)"
								>
									<Calendar.Day>
										{#snippet child({ props, day })}
											{#if event}
												<a
													{...props}
													href={event.url}
													data-sveltekit-reset="false"
													class={[
														'font-bold ring-2 ring-brand/70 focus-ring transition-colors ring-inset hover:bg-brand/10',
														dayClasses,
														page.url.pathname === event.url &&
															'bg-brand text-brand-contrast ring-brand hover:bg-brand',
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
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	{/snippet}
</Calendar.Root>
