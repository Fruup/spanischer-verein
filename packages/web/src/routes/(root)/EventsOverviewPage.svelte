<script lang="ts">
	import { navigating } from '$app/stores'
	import Loader from '$lib/components/icons/Loader2.svelte'
	import EventsOverview from './EventsOverview.svelte'

	export let events: any[]
	export let pastHighlights: any[]
	export let year: number
	export let month: number

	$: isPast = new Date().getTime() > new Date(year, month).getTime()

	$: eventsAfterNow = events.filter(
		(event) => new Date(event.eventTime).getTime() >= new Date().getTime(),
	)

	$: futureEvents = isPast ? events : eventsAfterNow

	$: monthString = new Date(year, month - 1).toLocaleString(undefined, {
		month: 'long',
		year: 'numeric',
	})
</script>

<h3 class="current-heading">
	<span class="heading-2">Veranstaltungen</span>
	<span class="heading-3">{monthString}</span>
</h3>

{#if !events.length}
	<h3 class="no-events">
		In dieser Zeit {isPast ? 'waren' : 'sind'}<br />
		keine Veranstaltungen geplant...
	</h3>
{/if}

{#if !$navigating}
	<EventsOverview events={futureEvents} />

	{#if pastHighlights.length > 0}
		<div class="past-heading-container">
			<h3 class="heading-3">Vergangene Highlights</h3>
		</div>

		<EventsOverview events={pastHighlights} />

		<p>TBD</p>
	{/if}
{:else}
	<div class="loader-container">
		<Loader />
	</div>
{/if}

<style lang="scss">
	@import 'vars';

	.current-heading {
		display: flex;
		justify-content: space-between;
		align-items: center;

		margin: 0;

		:global(> *) {
			margin-top: 0;
		}
	}

	.no-events {
		color: var(--color-text-1);
		text-align: center;
		margin-top: 6rem;
		width: 100%;
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
</style>
