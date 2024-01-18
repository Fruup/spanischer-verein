<script lang="ts">
	import { createCalendar, melt } from '@melt-ui/svelte'
	import IconAngle from '../icons/IconAngle.svelte'
	import { type EventCalendarItem } from './helpers'
	import EventCalendarMonth from './EventCalendarMonth.svelte'

	const {
		elements: { calendar, cell, grid, heading, nextButton, prevButton },
		helpers: { isDateDisabled },
		states: { months, headingValue, weekdays },
	} = createCalendar({
		fixedWeeks: true,
		readonly: true,
		calendarLabel: 'Veranstaltungskalender',
		locale: 'de',
	})

	let { events } = $props<{
		events: EventCalendarItem[]
	}>()

	// TODO: draw cool SVG path to the linked element.
	const handleFocus = (event: Event) => {}
	const handleBlur = (event: Event) => {}
</script>

<div class="calendar" use:melt={$calendar}>
	<div class="heading" use:melt={$heading}>
		<button type="button" class="left" use:melt={$prevButton}>
			<IconAngle direction="left" />
		</button>

		<div class="value">
			{$headingValue}
		</div>
		<button class="right" use:melt={$nextButton}>
			<IconAngle direction="right" />
		</button>
	</div>

	<div class="weekdays">
		{#each $weekdays as weekday}
			<div class="cell" use:melt={$cell}>
				{weekday}
			</div>
		{/each}
	</div>

	{#each $months as month}
		<EventCalendarMonth
			{events}
			{cell}
			{grid}
			{month}
			isDateDisabled={$isDateDisabled}
			frozen={false}
		/>
	{/each}
</div>

<style lang="scss">
	.heading {
		display: flex;
		justify-content: space-between;
		align-items: stretch;

		.value {
			text-align: center;
			flex-grow: 1;
		}

		button {
			width: 2rem;
			height: 2rem;
			padding: 0;
			margin: 0;

			border: 1px solid grey;

			&:hover,
			&:active {
				background-color: rgba(0, 0, 0, 0.05);
			}

			border-radius: 12px;
		}
	}

	.weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		background-color: rgba(0, 0, 0, 0.05);

		margin: 0.5rem 0;
		border-radius: 12px;
	}

	hr {
		+ hr {
			margin-top: 0.333rem;
		}

		~ hr {
			margin-bottom: 0;
		}
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
		// border: 0.75px solid grey;

		&:not(.active) {
			opacity: 0.5;
		}

		&.today {
			// background-color: #ff7700;
			// box-shadow: inset 0 0 0 2px #ff7700;
			// color: white;
			text-decoration: underline;
			font-weight: bold;
			border: 1px solid grey;
		}

		margin: 0.125rem;
		border-radius: 0.5rem;
	}

	a.cell {
		// text-decoration: underline;
		// background-color: #ff7700;

		box-shadow: inset 0 0 0 2px #ff7700;
		border-color: #ff7700;

		&.current {
			// color: white;
			// background-color: #ff9335;
		}
	}
</style>
