<script lang="ts">
	import { navigating } from '$app/stores'
	import Note from '$lib/components/Note.svelte'
	import Loader from '$lib/components/icons/Loader.svelte'
	import EventsOverview from './EventsOverview.svelte'
	import { isMobileCalendarOpen } from './MobileCalendar.svelte'

	export let events: any[]
	export let pastHighlights: any[]
	export let year: number
	export let month: number

	$: isPast = new Date().getTime() > new Date(year, month).getTime()

	// Grace time for events to be considered past
	const graceTime = 1000 * 60 * 60 * 6 // 6 hours

	$: eventsAfterNow = events.filter(
		(event) => new Date(event.eventTime).getTime() + graceTime >= new Date().getTime(),
	)

	$: futureEvents = isPast ? events : eventsAfterNow

	$: monthString = new Date(year, month - 1).toLocaleString(undefined, {
		month: 'long',
		year: 'numeric',
	})

	function jumpToCalendar() {
		if (window.matchMedia('(max-width: 768px)').matches) {
			$isMobileCalendarOpen = true
		} else {
			const element = document.querySelector('#calendar')
			element?.scrollIntoView({ behavior: 'smooth' })
		}
	}
</script>

<h3 class="current-heading">
	<span class="heading-2">Veranstaltungen</span>
	<span class="heading-3">{monthString}</span>
</h3>

{#if !futureEvents.length}
	<Note>
		In dieser Zeit {isPast ? 'waren' : 'sind'}<br />
		keine Veranstaltungen geplant...
	</Note>
{/if}

{#if !$navigating}
	<EventsOverview events={futureEvents} />

	{#if pastHighlights.length > 0}
		<div class="past-heading-container">
			<h3 class="heading-3">Vergangene Highlights</h3>
		</div>

		<EventsOverview events={pastHighlights} />

		<Note>
			Um weitere vergangene Events zu entdecken,<br />
			nutze unseren <button class="calendar-button" on:click={jumpToCalendar}>Kalender</button>.
		</Note>
	{/if}
{:else}
	<div class="loader-container">
		<Loader />
	</div>
{/if}

<style lang="scss">
	@use 'sass:color';
	@import 'vars';

	.current-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;

		margin: 0;

		:global(> *) {
			margin-top: 0;
		}

		@include max-md {
			flex-direction: column;
			gap: 0.5rem;

			.heading-2 {
				align-self: flex-start;
				margin-bottom: 0;
			}

			.heading-3 {
				align-self: flex-end;
			}
		}
	}

	.loader-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 50vh;

		:global(svg) {
			width: 5rem;
			height: 5rem;
		}
	}

	.past-heading-container {
		margin-top: 4rem;
		margin-bottom: 2rem;

		display: flex;
		justify-content: end;

		:global(> *) {
			margin: 0;
		}
	}

	.calendar-button {
		text-decoration: underline;
		background: none;
		border: none;
		text-decoration-color: $color-accent;
		font-size: 1em;
		padding: 0;
		margin: 0;
		display: inline;
		color: inherit;
		cursor: pointer;

		&:hover,
		&:focus {
			color: $color-accent;
		}
	}
</style>
