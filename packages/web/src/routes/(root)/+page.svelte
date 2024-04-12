<script lang="ts">
	import EventsOverview from './EventsOverview.svelte'

	export let data

	$: events = data.events
</script>

<h3 class="heading-2">Kommende Veranstaltungen</h3>

{#if !events.length}
	<h3 class="no-events">In nächster Zeit sind keine Veranstaltungen geplant...</h3>
{/if}

<EventsOverview {events} />

<style lang="scss">
	.no-events {
		text-align: center;
		margin-top: 10rem;
	}
</style>
