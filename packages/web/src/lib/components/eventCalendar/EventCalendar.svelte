<script lang="ts">
	import { buildMonth, isEqualDate, isItemActive, isToday } from './helpers'
	import { page } from '$app/stores'
	import { DateTime } from 'luxon'
	import IconAngleDown from '../icons/IconAngleDown.svelte'

	interface EventCalendarItem {
		name: string
		url: string
		date: Date
	}

	let { events } = $props<{
		events: EventCalendarItem[]
	}>()

	let activeMonthIndex = $state(0)
	const displayedTime = $derived(DateTime.now().plus({ month: activeMonthIndex }))

	$inspect(displayedTime)

	const getEvents = (item: DateTime): EventCalendarItem[] =>
		events.filter((event) => isEqualDate(item, event.date))

	const handleClickUp = async () => {
		// await tick()
		activeMonthIndex--
	}

	const handleClickDown = () => {
		activeMonthIndex++
	}

	// TODO: draw cool SVG path to the linked element.
	const handleFocus = (event: Event) => {}
	const handleBlur = (event: Event) => {}
</script>

{#snippet month(index: number)}
	<div class="month">
		{#each buildMonth(index) as item, i}
			{@const events = getEvents(item)}

			{#if events.length > 0}
				<!-- {#if events.length > 1} -->
				<!-- TODO: button that opens a popup with selections -->
				<!-- {:else if events.length === 1} -->
				{@const event = events[0]}

				<a
					class="item"
					class:current={event.url === $page.url.pathname}
					class:active={isItemActive(item, index)}
					class:today={isToday(item)}
					href={event.url}
					onfocus={handleFocus}
					onblur={handleBlur}
					onmouseenter={handleFocus}
					onmouseleave={handleBlur}
				>
					{item.day}
				</a>
			{:else}
				<div class="item" class:today={isToday(item)} class:active={isItemActive(item, index)}>
					{item.day}
				</div>
			{/if}
		{/each}
	</div>
{/snippet}

<div class="event-calendar">
	<button type="button" class="up" onclick={handleClickUp}>
		<IconAngleDown />
	</button>

	<div class="displayed-time-container">
		{displayedTime.toFormat('MMMM yyyy')}
	</div>

	{@render month(activeMonthIndex)}

	<button type="button" class="down" onclick={handleClickDown}>
		<IconAngleDown />
	</button>
</div>

<style lang="scss">
	.event-calendar {
		user-select: none;
	}

	.month {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 1fr);
	}

	button {
		height: 1.5rem;
		width: 100%;
		margin: 0;
		padding: 0;

		display: grid;
		place-content: center;

		border: 1px solid grey;

		&.up {
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
			border-bottom-width: 0.5px;

			:global(svg) {
				transform: rotate(180deg);
			}
		}

		&.down {
			border-bottom-left-radius: 8px;
			border-bottom-right-radius: 8px;
			border-top-width: 0.5px;
		}
	}

	.displayed-time-container {
		display: grid;
		place-content: center;

		width: 100%;
		font-size: 0.9rem;

		border: 0.5px solid grey;
	}

	.item {
		display: grid;
		place-content: center;

		aspect-ratio: 1;
		height: auto;
		border: 0.75px solid grey;

		&:not(.active) {
			opacity: 0.5;
		}

		&.today {
			// background-color: #ff7700;
			// box-shadow: inset 0 0 0 2px #ff7700;
			// color: white;
			text-decoration: underline;
			font-weight: bold;
		}
	}

	a.item {
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
