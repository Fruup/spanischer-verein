<script lang="ts">
	import EventsOverviewPage from './events-overview-page.svelte'
	import { eventsOverviewStore } from './events-overview-store.svelte'

	await eventsOverviewStore.init()
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>
</svelte:head>

<EventsOverviewPage
	events={eventsOverviewStore.events}
	hasMore={eventsOverviewStore.hasMore}
	loading={eventsOverviewStore.loading}
	loadMore={() => eventsOverviewStore.loadMore()}
/>
