<script lang="ts">
	import { page as pageState } from '$app/state'

	import { getCurrentEventsOverview } from '#lib/sanity/sanity.remote.js'

	import EventsOverviewPage from './events-overview-page.svelte'

	// Pagination lives in the URL as `?page=N` (page 1 being `/`) rather than in
	// client-only state, so a crawler following "Mehr laden" reaches the older
	// events as well. The clamp mirrors the bound the remote function validates.
	const pageIndex = $derived(
		Math.min(100, Math.max(0, (parseInt(pageState.url.searchParams.get('page') ?? '') || 1) - 1)),
	)

	const overview = $derived(await getCurrentEventsOverview(pageIndex))
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>
</svelte:head>

<EventsOverviewPage events={overview.events} hasMore={overview.hasMore} {pageIndex} />
