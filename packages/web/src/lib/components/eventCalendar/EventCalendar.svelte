<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'
	import IconAngle from '../icons/IconAngle.svelte'
	import { type EventCalendarItem } from './helpers'
	import EventCalendarMonth from './EventCalendarMonth.svelte'
	import { locale } from '$lib/services/locale'
	import { page } from '$app/stores'
	import MonthSelector from './MonthSelector.svelte'

	export let events: EventCalendarItem[]

	$: selected = {
		year: Number($page.params.year) || new Date().getFullYear(),
		month: Number($page.params.month) || new Date().getMonth() + 1,
	}

	$: next = {
		year: selected.month === 12 ? selected.year + 1 : selected.year,
		month: selected.month === 12 ? 1 : selected.month + 1,
	}

	$: prev = {
		year: selected.month === 1 ? selected.year - 1 : selected.year,
		month: selected.month === 1 ? 12 : selected.month - 1,
	}

	const {
		elements: { calendar, cell, grid, heading, nextButton, prevButton },
		helpers: { isDateDisabled, setMonth, setYear },
		states: { months, weekdays },
		options: {},
	} = createCalendar({
		fixedWeeks: true,
		readonly: true,
		calendarLabel: 'Veranstaltungskalender',
		locale: $locale,
	})

	$: if (selected) {
		setMonth(selected.month)
		setYear(selected.year)
	}
</script>

<div class="calendar" use:melt={$calendar}>
	<div class="heading" use:melt={$heading}>
		<a
			href="/archiv/{prev.year}-{prev.month.toString().padStart(2, '0')}"
			class="left"
			data-sveltekit-noscroll
			use:melt={$prevButton}
		>
			<IconAngle direction="left" />
		</a>

		<MonthSelector bind:value={selected} />

		<a
			href="/archiv/{next.year}-{next.month.toString().padStart(2, '0')}"
			data-sveltekit-noscroll
			class="right"
			use:melt={$nextButton}
		>
			<IconAngle direction="right" />
		</a>
	</div>

	<div class="weekdays">
		{#each $weekdays as weekday}
			<div class="cell" use:melt={$cell}>
				{weekday}
			</div>
		{/each}
	</div>

	{#each $months as month}
		<EventCalendarMonth {events} {cell} {grid} {month} isDateDisabled={$isDateDisabled} />
	{/each}
</div>

<style lang="scss">
	@import 'vars';

	.calendar {
		z-index: 10000;
		width: fit-content;
		padding: 1em;

		font-size: 0.85rem;

		@include surface;

		border-radius: 24px;
		box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 0.1);

		--cell-width: 2em;
		--cell-gap: 0.125em;
	}

	.heading {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		gap: 0.25em;

		:global(.month-selector) {
			flex-grow: 1;
		}

		a {
			width: var(--cell-width);
			height: auto;
			aspect-ratio: 1;

			padding: 0;
			margin: 0;

			display: grid;
			place-content: center;

			cursor: pointer;

			border: none;
			border-radius: 8px;

			color: white;
			background-color: $color-accent;

			&:hover,
			&:active {
				border-color: $color-accent;
			}
		}
	}

	.weekdays {
		display: grid;
		grid-template-columns: repeat(7, var(--cell-width));
		background-color: rgba(0, 0, 0, 0.05);

		margin: 0.5rem 0;
		border-radius: 12px;
	}

	.displayed-time-container {
		display: grid;
		place-content: center;

		width: 100%;
		font-size: 0.9rem;

		border: 0.5px solid grey;
	}

	.cell {
		display: grid;
		place-content: center;

		aspect-ratio: 1;
		height: auto;

		&:not(.active) {
			opacity: 0.5;
		}

		&.today {
			text-decoration: underline;
			font-weight: bold;
			border: 1px solid grey;
		}

		margin: var(--cell-gap);
		border-radius: 0.5rem;
	}
</style>
