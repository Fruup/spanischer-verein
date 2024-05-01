<script lang="ts">
	import { isToday, type DateValue, getLocalTimeZone } from '@internationalized/date'
	import { melt, type Month } from '@melt-ui/svelte'
	import { getEventsForDay, type EventCalendarItem } from './helpers'
	import { page } from '$app/stores'

	export let cell: any
	export let grid: any
	export let isDateDisabled: any

	export let month: Month<DateValue>
	export let events: EventCalendarItem[]

	$: pathname = $page.url.pathname
</script>

<div class="month" use:melt={$grid}>
	{#each month.weeks as week}
		{#each week as day}
			{@const eventsForDay = getEventsForDay(day, events)}

			{#if eventsForDay.length === 0}
				<span
					use:melt={$cell}
					class="cell"
					class:active={!isDateDisabled(day)}
					class:today={isToday(day, getLocalTimeZone())}
				>
					{day.day}
				</span>
				<!-- {:else if eventsForDay.length === 1} -->
			{:else}
				{@const event = eventsForDay[0]}

				<a
					href={event.url}
					use:melt={$cell}
					class="cell"
					class:active={!isDateDisabled(day)}
					class:shown={pathname === event.url}
				>
					{day.day}
				</a>
				<!-- {:else} -->
				<!-- TODO: popover -->
			{/if}
		{/each}
	{/each}
</div>

<style lang="scss">
	@import 'vars';

	.month {
		display: grid;
		grid-template-columns: repeat(7, var(--cell-width));
		gap: var(--cell-gap);
		user-select: none;
	}

	.cell {
		display: grid;
		place-content: center;

		aspect-ratio: 1;
		height: auto;
		// width: 2em;

		&:not(.active) {
			opacity: 0.5;
		}

		&.today {
			font-weight: bold;
			border: 1px solid grey;
		}

		// margin: 0.125em;
		border-radius: 0.5rem;
	}

	a.cell {
		box-shadow: inset 0 0 0 2px $color-accent;
		border-color: $color-accent;

		&.shown {
			background-color: $color-accent;
			color: white;
		}
	}
</style>
