<script lang="ts">
	import { getCurrentEventsOverview } from '#lib/api/content-api.remote.js'

	import EventsOverviewPage from './events-overview-page.svelte'

	let pageIndex = 0
	const overview = await getCurrentEventsOverview(pageIndex)

	let events = $state(overview.events)
	let hasMore = $state(overview.hasMore)
	let loading = $state(false)

	const loadMore = async () => {
		loading = true

		try {
			const overview = await getCurrentEventsOverview(pageIndex + 1)

			pageIndex++

			events.push(...overview.events)
			hasMore = overview.hasMore
		} catch (e) {
			console.error(e)
		} finally {
			loading = false
		}
	}
</script>

<svelte:head>
	<title>Spanischer Verein Köln</title>
</svelte:head>

<EventsOverviewPage {events} {hasMore} {loadMore} {loading} />
