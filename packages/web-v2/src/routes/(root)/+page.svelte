<script lang="ts">
	import { getCurrentEventsOverview } from '#lib/sanity/sanity.remote.js'

	import EventsOverviewPage from './events-overview-page.svelte'

	const events = await getCurrentEventsOverview()
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>
</svelte:head>

<EventsOverviewPage {events} />
