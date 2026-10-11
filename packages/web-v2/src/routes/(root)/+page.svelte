<script lang="ts">
	import { getEventsOverview, getPastHighlights } from '#lib/sanity/sanity.remote.js'

	import EventsOverviewPage from './events-overview-page.svelte'

	const year = new Date().getFullYear()
	const month = new Date().getMonth() + 1

	const events = await getEventsOverview({ year, month })
	const pastHighlights = await getPastHighlights()
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>
</svelte:head>

<EventsOverviewPage {events} {pastHighlights} {year} {month} />
