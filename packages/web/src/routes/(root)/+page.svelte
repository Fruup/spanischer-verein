<script lang="ts">
	import EventsOverviewPage from './EventsOverviewPage.svelte'

	export let data

	const year = new Date().getFullYear()
	const month = new Date().getMonth() + 1
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>
</svelte:head>

<EventsOverviewPage events={data.events} pastHighlights={data.pastHighlights} {year} {month} />
