<script lang="ts">
	import { page } from '$app/state'

	import Page from '#lib/components/Page.svelte'
	import type { EventInfoSpec } from '#lib/components/EventInfo.svelte'
	import { getNewsletterEvent } from '#lib/sanity/sanity.remote.js'

	const event = await getNewsletterEvent(page.params.slug ?? '')

	const eventInfo: EventInfoSpec = {
		admission: event.eventAdmission,
		time: event.eventTime,
		location: event.eventLocation,
	}
</script>

<svelte:head>
	<title>{event.title} - Spanischer Verein Köln</title>
</svelte:head>

<Page title={event.title} body={event.body} {eventInfo} />
