<script lang="ts">
	import { isToday, type DateValue, getLocalTimeZone } from '@internationalized/date'
	import { melt, type Month } from '@melt-ui/svelte'
	import { getEventsForDay, type EventCalendarItem } from './helpers'
	import { page } from '$app/stores'

	interface State {
		month: Month<DateValue>
		events: EventCalendarItem[]
	}

	export let frozen: boolean | undefined = undefined
	export let cell: any
	export let grid: any
	export let isDateDisabled: any

	export let month: Month<DateValue>
	export let events: EventCalendarItem[]

	$: pathname = $page.url.pathname

	// $effect(() => {
	// 	if (frozen) return

	// 	state = {
	// 		month,
	// 		events,
	// 	}
	// })
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
		grid-template-columns: repeat(7, 1fr);
		user-select: none;
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
			font-weight: bold;
			border: 1px solid grey;
		}

		margin: 0.125rem;
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
