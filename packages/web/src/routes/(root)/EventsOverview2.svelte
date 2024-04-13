<script lang="ts">
	import { navigating } from '$app/stores'
	import Loader from '$lib/components/icons/Loader.svelte'
	import EventsOverview from './EventsOverview.svelte'

	export let events: any[]
	export let year: number
	export let month: number

	$: isPast = new Date().getTime() > new Date(year, month).getTime()

	$: eventsBeforeNow = events.filter(
		(event) => new Date(event.eventTime).getTime() < new Date().getTime(),
	)

	$: eventsAfterNow = events.filter(
		(event) => new Date(event.eventTime).getTime() >= new Date().getTime(),
	)

	$: futureEvents = isPast ? events : eventsAfterNow
	$: pastEvents = isPast ? [] : eventsBeforeNow

	$: monthString = new Date(year, month - 1).toLocaleString(undefined, {
		month: 'long',
		year: 'numeric',
	})
</script>

<h3>
	<span class="heading-2">Veranstaltungen</span>
	<span class="heading-3">{monthString}</span>
</h3>

{#if !events.length}
	<h3 class="no-events">
		In dieser Zeit {isPast ? 'waren' : 'sind'} keine Veranstaltungen geplant...
	</h3>
{/if}

{#if !$navigating}
	<EventsOverview events={futureEvents} />

	{#if pastEvents.length > 0}
		<h3 class="heading-past heading-3">Vergangene Veranstaltungen</h3>

		<EventsOverview events={pastEvents} />
	{/if}
{:else}
	<div class="loader-container">
		<Loader />
	</div>
{/if}

<style lang="scss">
	h3 {
		display: flex;
		justify-content: space-between;
		align-items: center;

		margin: 0;
	}

	.no-events {
		text-align: center;
		margin-top: 10rem;
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

	.heading-past {
		margin-top: 4rem;
	}
</style>
