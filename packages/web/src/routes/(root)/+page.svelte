<script lang="ts">
	import EventsOverviewPage from './EventsOverviewPage.svelte'

	export let data

	const year = new Date().getFullYear()
	const month = new Date().getMonth() + 1
</script>

<EventsOverviewPage events={data.events} pastHighlights={data.pastHighlights} {year} {month} />
