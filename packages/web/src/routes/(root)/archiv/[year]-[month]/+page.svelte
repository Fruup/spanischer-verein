<script lang="ts">
	import EventsOverview2 from '../../EventsOverview2.svelte'

	export let data

	$: events = data.events
	$: year = data.year
	$: month = data.month
</script>

<EventsOverview2 {events} {year} {month} />
