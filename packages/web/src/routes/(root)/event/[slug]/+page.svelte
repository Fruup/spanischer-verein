<script lang="ts">
	import Page from '$lib/components/Page.svelte'
	import type { EventInfoSpec } from '$lib/components/EventInfo.svelte'

	export let data
	let { title, body } = data.event

	$: eventInfo = {
		admission: data.event.eventAdmission,
		time: data.event.eventTime,
		location: data.event.eventLocation,
	} satisfies EventInfoSpec
</script>

<svelte:head>
	<title>{data.event.title} - Spanischer Verein Köln</title>
</svelte:head>

<Page {title} {body} {eventInfo} />
