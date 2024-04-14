<script lang="ts">
	import EventsOverview2 from './EventsOverview2.svelte'

	export let data

	const year = new Date().getFullYear()
	const month = new Date().getMonth() + 1
</script>

<EventsOverview2 events={data.events} {year} {month} />
